import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import {
  ApiErrorSchema,
  ContactAcceptedSchema,
  ContactRequestSchema,
  HealthResponseSchema,
  LanguageSchema,
  PageViewRequestSchema,
  SiteContentSchema,
} from "@portfolio/contracts";
import { eq, sql } from "drizzle-orm";
import type { AppConfig } from "./config";
import { acceptContact, consumeContactRateLimit } from "./contact";
import type { Database } from "./db/client";
import { analyticsPageViews, contactOutbox, siteContent } from "./db/schema";
import {
  contactAccepted,
  httpDuration,
  httpRequests,
  inFlight,
  outboxMessages,
  pageViews,
  registry,
} from "./metrics";
import {
  analyticsOptedOut,
  coarseUserAgent,
  dailyVisitorHash,
  resolveClientIp,
  resolveCountry,
} from "./privacy";

type AppEnv = {
  Bindings: { remoteAddress?: string };
  Variables: { requestId: string };
};

export type AppDependencies = {
  config: AppConfig;
  db: Database;
  pingDatabase: () => Promise<void>;
};

function errorBody(requestId: string, code: z.infer<typeof ApiErrorSchema>["error"]["code"], message: string) {
  return { error: { code, message, requestId } };
}

const errorResponses = {
  422: { content: { "application/json": { schema: ApiErrorSchema } }, description: "Validation failed" },
  429: { content: { "application/json": { schema: ApiErrorSchema } }, description: "Rate limited" },
  500: { content: { "application/json": { schema: ApiErrorSchema } }, description: "Internal error" },
  503: { content: { "application/json": { schema: ApiErrorSchema } }, description: "Dependency unavailable" },
} as const;

export function createApp({ config, db, pingDatabase }: AppDependencies) {
  const app = new OpenAPIHono<AppEnv>({
    defaultHook: (result, c) => {
      if (result.success) return;
      const fields = Object.fromEntries(
        result.error.issues.map((issue) => [issue.path.join(".") || "request", issue.message]),
      );
      return c.json(
        {
          error: {
            code: "VALIDATION_ERROR" as const,
            message: "Request validation failed",
            requestId: c.get("requestId"),
            fields,
          },
        },
        422,
      );
    },
  });

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

  app.openapi(
    createRoute({
      method: "get",
      path: "/api/v1/health/live",
      responses: { 200: { content: { "application/json": { schema: HealthResponseSchema } }, description: "Process is live" } },
    }),
    (c) => c.json({ status: "ok" as const }, 200),
  );

  app.openapi(
    createRoute({
      method: "get",
      path: "/api/v1/health/ready",
      responses: {
        200: { content: { "application/json": { schema: HealthResponseSchema } }, description: "Dependencies are ready" },
        503: errorResponses[503],
      },
    }),
    async (c) => {
      try {
        await pingDatabase();
        return c.json({ status: "ok" as const, checks: { database: "up" as const } }, 200);
      } catch {
        return c.json(errorBody(c.get("requestId"), "DEPENDENCY_UNAVAILABLE", "Database unavailable"), 503);
      }
    },
  );

  app.openapi(
    createRoute({
      method: "get",
      path: "/api/v1/content/{locale}",
      request: { params: z.object({ locale: LanguageSchema }) },
      responses: {
        200: { content: { "application/json": { schema: SiteContentSchema } }, description: "Localized site content" },
        404: { content: { "application/json": { schema: ApiErrorSchema } }, description: "Content not found" },
      },
    }),
    async (c) => {
      const { locale } = c.req.valid("param");
      const [row] = await db.select().from(siteContent).where(eq(siteContent.locale, locale)).limit(1);
      if (!row) return c.json(errorBody(c.get("requestId"), "NOT_FOUND", "Content not found"), 404);
      return c.json(SiteContentSchema.parse(row.payload), 200);
    },
  );

  app.openapi(
    createRoute({
      method: "post",
      path: "/api/v1/contact",
      request: { body: { required: true, content: { "application/json": { schema: ContactRequestSchema } } } },
      responses: {
        202: { content: { "application/json": { schema: ContactAcceptedSchema } }, description: "Queued for delivery" },
        422: errorResponses[422],
        429: errorResponses[429],
        500: errorResponses[500],
      },
    }),
    async (c) => {
      const requestId = c.get("requestId");
      const input = c.req.valid("json");
      if (input.website) return c.json({ status: "accepted" as const, requestId }, 202);
      const ip = resolveClientIp(c.req.raw.headers, c.env.remoteAddress, config);
      const visitorKey = dailyVisitorHash(ip, config.ANALYTICS_HMAC_SECRET);
      if (!(await consumeContactRateLimit(db, visitorKey, config.CONTACT_RATE_LIMIT_PER_HOUR))) {
        return c.json(errorBody(requestId, "RATE_LIMITED", "Too many requests"), 429);
      }
      await acceptContact(db, {
        name: input.name,
        email: input.email,
        message: input.message,
        locale: input.locale,
      });
      contactAccepted.inc();
      return c.json({ status: "accepted" as const, requestId }, 202);
    },
  );

  app.openapi(
    createRoute({
      method: "post",
      path: "/api/v1/analytics/pageviews",
      request: { body: { required: true, content: { "application/json": { schema: PageViewRequestSchema } } } },
      responses: { 204: { description: "Recorded or privacy opt-out honored" }, 422: errorResponses[422] },
    }),
    async (c) => {
      if (analyticsOptedOut(c.req.raw.headers)) return c.body(null, 204);
      const input = c.req.valid("json");
      const ip = resolveClientIp(c.req.raw.headers, c.env.remoteAddress, config);
      const userAgent = coarseUserAgent(c.req.header("user-agent"));
      await db.insert(analyticsPageViews).values({
        path: input.path,
        locale: input.locale,
        countryCode: resolveCountry(c.req.raw.headers, c.env.remoteAddress, config),
        deviceClass: userAgent.deviceClass,
        userAgentFamily: userAgent.family,
        visitorDayHash: dailyVisitorHash(ip, config.ANALYTICS_HMAC_SECRET),
      });
      pageViews.inc({ locale: input.locale, device: userAgent.deviceClass });
      return c.body(null, 204);
    },
  );

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

  app.doc("/api/v1/openapi.json", {
    openapi: "3.1.0",
    info: { title: "Portfolio API", version: "0.1.0" },
  });
  app.get("/api/v1/docs", swaggerUI({ url: "/api/v1/openapi.json" }));

  app.notFound((c) => c.json(errorBody(c.get("requestId"), "NOT_FOUND", "Route not found"), 404));
  app.onError((error, c) => {
    console.error(JSON.stringify({ event: "request_failed", requestId: c.get("requestId"), error: error.name }));
    return c.json(errorBody(c.get("requestId"), "INTERNAL_ERROR", "Internal server error"), 500);
  });

  return app;
}
