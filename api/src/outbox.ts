import type postgres from "postgres";
import type { AppConfig } from "./config";
import type { Mailer, ContactMessage } from "./contact";
import { computeBackoffSeconds } from "./contact";

type SqlClient = ReturnType<typeof postgres>;

type ClaimedMessage = ContactMessage & {
  outboxId: string;
  attempts: number;
};

export async function claimNextMessage(
  client: SqlClient,
  workerId: string,
  maxAttempts: number,
): Promise<ClaimedMessage | undefined> {
  return client.begin(async (transaction) => {
    const rows = await transaction<
      Array<{
        outbox_id: string;
        attempts: number;
        id: string;
        name: string;
        email: string;
        message: string;
        locale: "es" | "en";
      }>
    >`
      WITH candidate AS (
        SELECT id
        FROM contact_outbox
        WHERE attempts < ${maxAttempts}
          AND (
            (status IN ('pending', 'retry') AND available_at <= now())
            OR (status = 'processing' AND locked_at < now() - interval '5 minutes')
          )
        ORDER BY created_at
        FOR UPDATE SKIP LOCKED
        LIMIT 1
      ), claimed AS (
        UPDATE contact_outbox AS outbox
        SET status = 'processing',
            attempts = outbox.attempts + 1,
            locked_at = now(),
            locked_by = ${workerId}
        FROM candidate
        WHERE outbox.id = candidate.id
        RETURNING outbox.id, outbox.contact_id, outbox.attempts
      )
      SELECT claimed.id AS outbox_id, claimed.attempts,
             message.id, message.name, message.email, message.message, message.locale
      FROM claimed
      JOIN contact_messages AS message ON message.id = claimed.contact_id
    `;
    const row = rows[0];
    if (!row) return undefined;
    return {
      outboxId: row.outbox_id,
      attempts: row.attempts,
      id: row.id,
      name: row.name,
      email: row.email,
      message: row.message,
      locale: row.locale,
    };
  }) as Promise<ClaimedMessage | undefined>;
}

function boundedErrorCode(error: unknown): string {
  if (error instanceof Error) return error.name.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 80) || "Error";
  return "UnknownError";
}

export async function deliverOne(
  client: SqlClient,
  mailer: Mailer,
  config: AppConfig,
  workerId: string,
): Promise<boolean> {
  const claimed = await claimNextMessage(client, workerId, config.OUTBOX_MAX_ATTEMPTS);
  if (!claimed) return false;
  try {
    await mailer.sendContact(claimed);
    await client`
      UPDATE contact_outbox
      SET status = 'sent', sent_at = now(), locked_at = NULL, locked_by = NULL, last_error_code = NULL
      WHERE id = ${claimed.outboxId} AND locked_by = ${workerId}
    `;
  } catch (error) {
    const terminal = claimed.attempts >= config.OUTBOX_MAX_ATTEMPTS;
    const availableAt = new Date(Date.now() + computeBackoffSeconds(claimed.attempts) * 1_000);
    await client`
      UPDATE contact_outbox
      SET status = ${terminal ? "failed" : "retry"},
          available_at = ${availableAt},
          locked_at = NULL,
          locked_by = NULL,
          last_error_code = ${boundedErrorCode(error)}
      WHERE id = ${claimed.outboxId} AND locked_by = ${workerId}
    `;
  }
  return true;
}

export async function runRetention(client: SqlClient, config: AppConfig): Promise<void> {
  await client`
    DELETE FROM analytics_page_views
    WHERE occurred_at < now() - (${config.ANALYTICS_RETENTION_DAYS} * interval '1 day')
  `;
  await client`
    DELETE FROM contact_messages AS message
    USING contact_outbox AS outbox
    WHERE outbox.contact_id = message.id
      AND (
        (outbox.status = 'sent' AND outbox.sent_at < now() - (${config.CONTACT_RETENTION_DAYS} * interval '1 day'))
        OR
        (outbox.status = 'failed' AND outbox.created_at < now() - (${config.CONTACT_RETENTION_DAYS} * interval '1 day'))
      )
  `;
  await client`DELETE FROM contact_rate_limits WHERE expires_at < now()`;
}
