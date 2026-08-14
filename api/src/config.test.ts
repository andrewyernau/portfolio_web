import { describe, expect, test } from "bun:test";
import { parseConfig } from "./config";

const required = {
  DATABASE_URL: "postgresql://test:test@localhost:5432/test",
  ANALYTICS_HMAC_SECRET: "a".repeat(32),
};

describe("runtime configuration", () => {
  test("parses safe development defaults", () => {
    const config = parseConfig({ APP_ENV: "test", ...required });
    expect(config.API_PORT).toBe(3000);
    expect(config.TRUST_PROXY).toBe(false);
    expect(config.SMTP_MODE).toBe("disabled");
  });

  test("requires an allowlist before trusting forwarded headers", () => {
    expect(() => parseConfig({ ...required, TRUST_PROXY: "true" })).toThrow();
  });

  test("accepts the canonical Compose contract without weakening validation", () => {
    const config = parseConfig({
      ...required,
      APP_ENV: "development",
      API_PORT: "3001",
      TRUST_PROXY: "true",
      TRUSTED_PROXY_HOPS: "1",
      SMTP_HOST: "mailpit",
      SMTP_FROM: "portfolio@example.test",
      SMTP_TO: "owner@example.test",
    });
    expect(config.API_PORT).toBe(3001);
    expect(config.SMTP_MODE).toBe("smtp");
    expect(config.SMTP_TO).toBe("owner@example.test");
  });

  test("fails closed when an enabled SMTP transport is incomplete", () => {
    expect(() => parseConfig({ ...required, SMTP_MODE: "smtp", SMTP_HOST: "mail.example.test" })).toThrow();
  });

  test("rejects local-only credentials in production", () => {
    expect(() =>
      parseConfig({
        APP_ENV: "production",
        DATABASE_URL: "postgresql://portfolio:portfolio_local_only@postgres:5432/portfolio",
        ANALYTICS_HMAC_SECRET: "local_only_change_me_32_characters",
        SMTP_MODE: "smtp",
        SMTP_HOST: "mailpit",
        SMTP_FROM: "portfolio@example.test",
        SMTP_TO: "owner@example.test",
      }),
    ).toThrow();
  });
});
