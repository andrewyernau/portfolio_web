import { z } from "@hono/zod-openapi";

export const LanguageSchema = z.enum(["es", "en"]).openapi("Language");
export type Language = z.infer<typeof LanguageSchema>;

export const ErrorCodeSchema = z
  .enum([
    "VALIDATION_ERROR",
    "RATE_LIMITED",
    "NOT_FOUND",
    "DEPENDENCY_UNAVAILABLE",
    "INTERNAL_ERROR",
  ])
  .openapi("ErrorCode");

export const ApiErrorSchema = z
  .object({
    error: z.object({
      code: ErrorCodeSchema,
      message: z.string(),
      requestId: z.string(),
      fields: z.record(z.string(), z.string()).optional(),
    }),
  })
  .openapi("ApiError");
export type ApiError = z.infer<typeof ApiErrorSchema>;

export const HealthResponseSchema = z
  .object({
    status: z.enum(["ok", "degraded"]),
    checks: z.record(z.string(), z.enum(["up", "down"])).optional(),
  })
  .openapi("HealthResponse");

const PublicationSchema = z.object({
  slug: z.string().min(1).max(100),
  title: z.string().min(1).max(160),
  summary: z.string().min(1).max(600),
  status: z.enum(["published", "coming-soon"]),
});

export const SiteContentSchema = z
  .object({
    language: LanguageSchema,
    navigation: z.object({
      home: z.string(),
      publications: z.string(),
      contact: z.string(),
    }),
    home: z.object({
      eyebrow: z.string(),
      title: z.string(),
      introduction: z.string(),
    }),
    publications: z.object({
      title: z.string(),
      introduction: z.string(),
      items: z.array(PublicationSchema),
    }),
    contact: z.object({
      title: z.string(),
      introduction: z.string(),
      nameLabel: z.string(),
      emailLabel: z.string(),
      messageLabel: z.string(),
      submitLabel: z.string(),
      successMessage: z.string(),
    }),
    footer: z.object({
      note: z.string(),
    }),
  })
  .openapi("SiteContent");
export type SiteContent = z.infer<typeof SiteContentSchema>;

export const ContactRequestSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(254),
    message: z.string().trim().min(10).max(5_000),
    locale: LanguageSchema,
    website: z.string().max(200).optional().default(""),
  })
  .openapi("ContactRequest");
export type ContactRequest = z.infer<typeof ContactRequestSchema>;

export const ContactAcceptedSchema = z
  .object({
    status: z.literal("accepted"),
    requestId: z.string(),
  })
  .openapi("ContactAccepted");

export const PageViewRequestSchema = z
  .object({
    path: z
      .string()
      .min(1)
      .max(256)
      .regex(/^\/[A-Za-z0-9/_-]*$/, "path must not contain a query or fragment"),
    locale: LanguageSchema,
  })
  .openapi("PageViewRequest");
export type PageViewRequest = z.infer<typeof PageViewRequestSchema>;
