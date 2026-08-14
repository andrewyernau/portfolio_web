import { describe, expect, test } from "bun:test";
import { parseConfig } from "./config";
import {
  analyticsOptedOut,
  coarseUserAgent,
  dailyVisitorHash,
  resolveClientIp,
  resolveCountry,
  truncateIpPrefix,
} from "./privacy";

const baseEnv = {
  APP_ENV: "test",
  DATABASE_URL: "postgresql://test:test@localhost:5432/test",
  ANALYTICS_HMAC_SECRET: "a".repeat(32),
};

describe("privacy minimization", () => {
  test("truncates IPv4 and IPv6 networks", () => {
    expect(truncateIpPrefix("203.0.113.42")).toBe("203.0.113.0/24");
    expect(truncateIpPrefix("2001:db8:abcd:12::1")).toBe("2001:0db8:abcd::/48");
    expect(truncateIpPrefix("not-an-ip")).toBe("unknown");
  });

  test("rotates a deterministic pseudonym every UTC day", () => {
    const first = dailyVisitorHash("203.0.113.42", "a".repeat(32), new Date("2026-07-15T23:59:00Z"));
    const samePrefix = dailyVisitorHash("203.0.113.99", "a".repeat(32), new Date("2026-07-15T12:00:00Z"));
    const nextDay = dailyVisitorHash("203.0.113.42", "a".repeat(32), new Date("2026-07-16T00:00:00Z"));
    expect(first).toBe(samePrefix);
    expect(first).not.toBe(nextDay);
    expect(first).toHaveLength(32);
  });

  test("reduces user agents to bounded dimensions", () => {
    expect(coarseUserAgent("Mozilla/5.0 (iPhone) AppleWebKit/605.1.15 Version/17 Mobile Safari/604.1")).toEqual({
      deviceClass: "mobile",
      family: "safari",
    });
    expect(coarseUserAgent("Googlebot/2.1")).toEqual({ deviceClass: "bot", family: "bot" });
    expect(coarseUserAgent("curl/8.12.1")).toEqual({ deviceClass: "unknown", family: "cli" });
  });

  test("honors DNT and GPC", () => {
    expect(analyticsOptedOut(new Headers({ DNT: "1" }))).toBe(true);
    expect(analyticsOptedOut(new Headers({ "Sec-GPC": "1" }))).toBe(true);
    expect(analyticsOptedOut(new Headers())).toBe(false);
  });

  test("accepts forwarding and country only from an allowlisted proxy", () => {
    const config = parseConfig({
      ...baseEnv,
      TRUST_PROXY: "true",
      TRUSTED_PROXY_ADDRESSES: "10.0.0.10",
    });
    const headers = new Headers({ "x-forwarded-for": "203.0.113.42", "x-country-code": "es" });
    expect(resolveClientIp(headers, "10.0.0.10", config)).toBe("203.0.113.42");
    expect(resolveCountry(headers, "10.0.0.10", config)).toBe("ES");
    expect(resolveClientIp(headers, "10.0.0.99", config)).toBe("10.0.0.99");
    expect(resolveCountry(headers, "10.0.0.99", config)).toBe("ZZ");
  });
});
