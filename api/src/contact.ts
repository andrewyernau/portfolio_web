import { sql } from "drizzle-orm";
import nodemailer from "nodemailer";
import type { AppConfig } from "./config";
import type { Database } from "./db/client";
import { contactMessages, contactOutbox, contactRateLimits } from "./db/schema";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  locale: "es" | "en";
};

export interface Mailer {
  sendContact(message: ContactMessage): Promise<void>;
}

export class SmtpMailer implements Mailer {
  private readonly transport;

  constructor(private readonly config: AppConfig) {
    if (config.SMTP_MODE !== "smtp" || !config.SMTP_HOST || !config.SMTP_FROM || !config.SMTP_TO) {
      throw new Error("SMTP is not configured");
    }
    this.transport = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_SECURE,
      ...(config.SMTP_USER && config.SMTP_PASSWORD
        ? { auth: { user: config.SMTP_USER, pass: config.SMTP_PASSWORD } }
        : {}),
    });
  }

  async sendContact(message: ContactMessage): Promise<void> {
    const subject = message.locale === "es" ? "Nuevo mensaje del portfolio" : "New portfolio message";
    await this.transport.sendMail({
      from: this.config.SMTP_FROM!,
      to: this.config.SMTP_TO!,
      replyTo: message.email,
      subject,
      text: `Name: ${message.name}\nEmail: ${message.email}\n\n${message.message}`,
    });
  }
}

export async function consumeContactRateLimit(
  db: Database,
  visitorKey: string,
  limit: number,
  now = new Date(),
): Promise<boolean> {
  const windowStart = new Date(now);
  windowStart.setUTCMinutes(0, 0, 0);
  const expiresAt = new Date(windowStart.getTime() + 2 * 60 * 60 * 1_000);
  const [row] = await db
    .insert(contactRateLimits)
    .values({ visitorKey, windowStart, expiresAt, attempts: 1 })
    .onConflictDoUpdate({
      target: [contactRateLimits.visitorKey, contactRateLimits.windowStart],
      set: { attempts: sql`${contactRateLimits.attempts} + 1`, expiresAt },
    })
    .returning({ attempts: contactRateLimits.attempts });
  return Boolean(row && row.attempts <= limit);
}

export async function acceptContact(
  db: Database,
  input: Omit<ContactMessage, "id">,
): Promise<string> {
  const contactId = crypto.randomUUID();
  await db.transaction(async (tx) => {
    await tx.insert(contactMessages).values({ id: contactId, ...input });
    await tx.insert(contactOutbox).values({ id: crypto.randomUUID(), contactId });
  });
  return contactId;
}

export function computeBackoffSeconds(attempt: number): number {
  return Math.min(30 * 2 ** Math.max(0, attempt - 1), 3_600);
}
