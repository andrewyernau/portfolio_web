import { sql } from "drizzle-orm";
import { Hono } from "hono";
import type { AppConfig } from "./config";
import type { Database } from "./db/client";
import { contactOutbox } from "./db/schema";
import {
  httpDuration,
  httpRequests,
  inFlight,
  outboxMessages,
  registry,
} from "./metrics";
import { createSite, notFound, serverError, type SiteEnv } from "./site/routes";

export type AppDependencies = {
  config: AppConfig;
  db: Database;
  pingDatabase: () => Promise<void>;
};

export function createApp({ config, db, pingDatabase }: AppDependencies) {
  const app = new Hono<SiteEnv>();

  app.use("*", async (c, next) => {
    const requestId = c.req.header("x-request-id")?.slice(0, 100) || crypto.randomUUID();
    c.set("requestId", requestId);
    c.header("x-request-id", requestId);
    const started = performance.now();
    inFlight.inc();
    try {
      await next();
    } finally {
      inFlight.dec();
      const route = c.req.routePath || "unmatched";
      const statusClass = `${Math.floor(c.res.status / 100)}xx`;
      httpRequests.inc({ method: c.req.method, route, status_class: statusClass });
      httpDuration.observe({ method: c.req.method, route }, (performance.now() - started) / 1_000);
    }
  });

  app.get("/api/v1/health/live", (c) => c.json({ status: "ok" as const }));

  app.get("/api/v1/health/ready", async (c) => {
    try {
      await pingDatabase();
      return c.json({ status: "ok" as const, checks: { database: "up" as const } });
    } catch {
      return c.json({ status: "degraded" as const, checks: { database: "down" as const } }, 503);
    }
  });

  app.get("/metrics", async (c) => {
    const rows = await db
      .select({ status: contactOutbox.status, total: sql<number>`count(*)::int` })
      .from(contactOutbox)
      .groupBy(contactOutbox.status);
    outboxMessages.reset();
    for (const status of ["pending", "processing", "retry", "sent", "failed"] as const) {
      outboxMessages.set({ status }, 0);
    }
    for (const row of rows) outboxMessages.set({ status: row.status }, row.total);
    c.header("content-type", registry.contentType);
    return c.body(await registry.metrics());
  });

  app.route("/", createSite(config, db));

  app.notFound(notFound);
  app.onError((error, c) => {
    console.error(JSON.stringify({ event: "request_failed", requestId: c.get("requestId"), error: error.name }));
    return serverError(c);
  });

  return app;
}
