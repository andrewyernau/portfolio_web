import { sql } from "drizzle-orm";
import { createApp } from "./app";
import { parseConfig } from "./config";
import { createDatabase } from "./db/client";

const config = parseConfig(process.env);
const { db } = createDatabase(config);
const app = createApp({
  config,
  db,
  pingDatabase: async () => {
    await db.execute(sql`select 1 from site_content limit 1`);
  },
});

Bun.serve({
  port: config.API_PORT,
  fetch(request, server) {
    const remoteAddress = server.requestIP(request)?.address;
    return app.fetch(request, remoteAddress ? { remoteAddress } : {});
  },
});

console.info(JSON.stringify({ event: "api_started", port: config.API_PORT }));
