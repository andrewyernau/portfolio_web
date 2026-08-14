import { parseConfig } from "./config";
import { SmtpMailer } from "./contact";
import { createDatabase } from "./db/client";
import { deliverOne, runRetention } from "./outbox";

const config = parseConfig(process.env);
if (config.SMTP_MODE !== "smtp") throw new Error("Worker requires SMTP_MODE=smtp");
const { client } = createDatabase(config);
const mailer = new SmtpMailer(config);
const workerId = `${process.pid}-${crypto.randomUUID()}`;
let lastRetention = 0;

console.info(JSON.stringify({ event: "outbox_worker_started", workerId }));

while (true) {
  if (Date.now() - lastRetention >= 60 * 60 * 1_000) {
    await runRetention(client, config);
    lastRetention = Date.now();
  }
  const delivered = await deliverOne(client, mailer, config, workerId);
  if (!delivered) await Bun.sleep(config.OUTBOX_POLL_MS);
}
