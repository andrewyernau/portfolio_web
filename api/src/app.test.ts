import { describe, expect, test } from "bun:test";
import type { Database } from "./db/client";
import { createApp } from "./app";
import { parseConfig } from "./config";

const config = parseConfig({
  APP_ENV: "test",
  DATABASE_URL: "postgresql://test:test@localhost:5432/test",
  ANALYTICS_HMAC_SECRET: "a".repeat(32),
});

function appWithDatabase(db = {} as Database) {
  return createApp({ config, db, pingDatabase: async () => {} });
}

describe("HTTP contract", () => {
  test("serves liveness and a complete OpenAPI document", async () => {
    const app = appWithDatabase();
    const live = await app.fetch(new Request("http://localhost/api/v1/health/live"), {});
    expect(live.status).toBe(200);
    expect(await live.json()).toEqual({ status: "ok" });

    const spec = await app.fetch(new Request("http://localhost/api/v1/openapi.json"), {});
    const body = (await spec.json()) as { paths: Record<string, unknown> };
    expect(spec.status).toBe(200);
    expect(Object.keys(body.paths)).toEqual(
      expect.arrayContaining([
        "/api/v1/health/live",
        "/api/v1/health/ready",
        "/api/v1/content/{locale}",
        "/api/v1/contact",
        "/api/v1/analytics/pageviews",
      ]),
    );
  });

  test("returns the shared 422 envelope for invalid input", async () => {
    const app = appWithDatabase();
    const response = await app.fetch(
      new Request("http://localhost/api/v1/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "x" }),
      }),
      {},
    );
    expect(response.status).toBe(422);
    const body = (await response.json()) as { error: { code: string; requestId: string } };
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.requestId).toBeString();
  });

  test("honors privacy opt-out before touching storage", async () => {
    const app = appWithDatabase();
    const response = await app.fetch(
      new Request("http://localhost/api/v1/analytics/pageviews", {
        method: "POST",
        headers: { "content-type": "application/json", "sec-gpc": "1" },
        body: JSON.stringify({ path: "/", locale: "es" }),
      }),
      {},
    );
    expect(response.status).toBe(204);
  });
});
