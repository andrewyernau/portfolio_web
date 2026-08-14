import { z } from "zod";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);
const optionalString = z.preprocess(emptyToUndefined, z.string().optional());
const optionalEmail = z.preprocess(emptyToUndefined, z.string().email().optional());
const envBoolean = z.preprocess(
  (value) => (typeof value === "string" ? value.toLowerCase() : value),
  z.enum(["true", "false"]).transform((value) => value === "true"),
);

const ConfigSchema = z
  .object({
    APP_ENV: z.enum(["development", "test", "production"]).default("development"),
    API_PORT: z.coerce.number().int().min(1).max(65_535).default(3_000),
    DATABASE_URL: z.string().min(1),
    ANALYTICS_HMAC_SECRET: z.string().min(32),
    ANALYTICS_RETENTION_DAYS: z.coerce.number().int().min(1).max(365).default(30),
    CONTACT_RETENTION_DAYS: z.coerce.number().int().min(1).max(3_650).default(365),
    CONTACT_RATE_LIMIT_PER_HOUR: z.coerce.number().int().min(1).max(100).default(5),
    TRUST_PROXY: envBoolean.default(false),
    TRUSTED_PROXY_ADDRESSES: z.string().default(""),
    TRUSTED_PROXY_HOPS: z.coerce.number().int().min(0).max(5).default(0),
    COUNTRY_HEADER: z.string().regex(/^[a-z0-9-]+$/).default("x-country-code"),
    SMTP_MODE: z.enum(["disabled", "smtp"]).default("disabled"),
    SMTP_HOST: optionalString,
    SMTP_PORT: z.coerce.number().int().min(1).max(65_535).default(1_025),
    SMTP_SECURE: envBoolean.default(false),
    SMTP_USER: optionalString,
    SMTP_PASSWORD: optionalString,
    SMTP_FROM: optionalEmail,
    SMTP_TO: optionalEmail,
    OUTBOX_POLL_MS: z.coerce.number().int().min(100).max(60_000).default(1_000),
    OUTBOX_MAX_ATTEMPTS: z.coerce.number().int().min(1).max(100).default(10),
  })
  .superRefine((value, ctx) => {
    if (value.TRUST_PROXY && value.TRUSTED_PROXY_ADDRESSES.trim() === "" && value.TRUSTED_PROXY_HOPS === 0) {
      ctx.addIssue({ code: "custom", path: ["TRUST_PROXY"], message: "an address allowlist or trusted hop count is required" });
    }
    if (value.SMTP_MODE === "smtp") {
      for (const key of ["SMTP_HOST", "SMTP_FROM", "SMTP_TO"] as const) {
        if (!value[key]) ctx.addIssue({ code: "custom", path: [key], message: "required for SMTP" });
      }
      if (Boolean(value.SMTP_USER) !== Boolean(value.SMTP_PASSWORD)) {
        ctx.addIssue({ code: "custom", path: ["SMTP_PASSWORD"], message: "SMTP_USER and SMTP_PASSWORD must be provided together" });
      }
    }
    if (value.APP_ENV === "production") {
      if (value.SMTP_MODE === "disabled") {
        ctx.addIssue({ code: "custom", path: ["SMTP_MODE"], message: "SMTP cannot be disabled in production" });
      }
      if (/local_only|change_me/i.test(value.ANALYTICS_HMAC_SECRET)) {
        ctx.addIssue({ code: "custom", path: ["ANALYTICS_HMAC_SECRET"], message: "replace the local analytics secret" });
      }
      if (/portfolio_local_only|change_me/i.test(value.DATABASE_URL)) {
        ctx.addIssue({ code: "custom", path: ["DATABASE_URL"], message: "replace the local database credentials" });
      }
      if (value.SMTP_HOST === "mailpit" || value.SMTP_FROM?.endsWith("@example.test") || value.SMTP_TO?.endsWith("@example.test")) {
        ctx.addIssue({ code: "custom", path: ["SMTP_HOST"], message: "replace the local SMTP configuration" });
      }
    }
  });

const DatabaseConfigSchema = z.object({ DATABASE_URL: z.string().min(1) });

export type AppConfig = z.infer<typeof ConfigSchema> & { trustedProxyAddresses: ReadonlySet<string> };

export function parseConfig(env: Record<string, string | undefined>): AppConfig {
  const normalized = { ...env, SMTP_MODE: env.SMTP_MODE ?? (env.SMTP_HOST ? "smtp" : undefined) };
  const parsed = ConfigSchema.parse(normalized);
  return {
    ...parsed,
    trustedProxyAddresses: new Set(
      parsed.TRUSTED_PROXY_ADDRESSES.split(",").map((value) => value.trim()).filter(Boolean),
    ),
  };
}

export function parseDatabaseConfig(env: Record<string, string | undefined>) {
  return DatabaseConfigSchema.parse(env);
}
