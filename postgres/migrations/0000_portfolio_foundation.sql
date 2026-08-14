CREATE TABLE "site_content" (
  "locale" varchar(2) PRIMARY KEY NOT NULL,
  "payload" jsonb NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "site_content_locale_check" CHECK ("locale" IN ('es', 'en'))
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
  "id" uuid PRIMARY KEY NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "name" varchar(100) NOT NULL,
  "email" varchar(254) NOT NULL,
  "message" text NOT NULL,
  "locale" varchar(2) NOT NULL,
  CONSTRAINT "contact_messages_locale_check" CHECK ("locale" IN ('es', 'en')),
  CONSTRAINT "contact_messages_message_length_check" CHECK (char_length("message") BETWEEN 10 AND 5000)
);
--> statement-breakpoint
CREATE TABLE "contact_outbox" (
  "id" uuid PRIMARY KEY NOT NULL,
  "contact_id" uuid NOT NULL REFERENCES "contact_messages"("id") ON DELETE CASCADE,
  "status" varchar(16) DEFAULT 'pending' NOT NULL,
  "attempts" integer DEFAULT 0 NOT NULL,
  "available_at" timestamptz DEFAULT now() NOT NULL,
  "locked_at" timestamptz,
  "locked_by" varchar(100),
  "last_error_code" varchar(80),
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "sent_at" timestamptz,
  CONSTRAINT "contact_outbox_status_check" CHECK ("status" IN ('pending', 'processing', 'retry', 'sent', 'failed')),
  CONSTRAINT "contact_outbox_attempts_check" CHECK ("attempts" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX "contact_outbox_contact_id_idx" ON "contact_outbox" ("contact_id");
--> statement-breakpoint
CREATE INDEX "contact_outbox_dispatch_idx" ON "contact_outbox" ("status", "available_at");
--> statement-breakpoint
CREATE TABLE "contact_rate_limits" (
  "visitor_key" varchar(32) NOT NULL,
  "window_start" timestamptz NOT NULL,
  "attempts" integer DEFAULT 1 NOT NULL,
  "expires_at" timestamptz NOT NULL,
  CONSTRAINT "contact_rate_limits_pk" PRIMARY KEY ("visitor_key", "window_start"),
  CONSTRAINT "contact_rate_limits_attempts_check" CHECK ("attempts" > 0)
);
--> statement-breakpoint
CREATE TABLE "analytics_page_views" (
  "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "occurred_at" timestamptz DEFAULT now() NOT NULL,
  "path" varchar(256) NOT NULL,
  "locale" varchar(2) NOT NULL,
  "country_code" varchar(2) DEFAULT 'ZZ' NOT NULL,
  "device_class" varchar(16) NOT NULL,
  "user_agent_family" varchar(16) NOT NULL,
  "visitor_day_hash" varchar(32) NOT NULL,
  CONSTRAINT "analytics_locale_check" CHECK ("locale" IN ('es', 'en')),
  CONSTRAINT "analytics_country_check" CHECK ("country_code" ~ '^[A-Z]{2}$'),
  CONSTRAINT "analytics_device_check" CHECK ("device_class" IN ('bot', 'desktop', 'mobile', 'tablet', 'unknown')),
  CONSTRAINT "analytics_ua_check" CHECK ("user_agent_family" IN ('bot', 'chrome', 'cli', 'edge', 'firefox', 'safari', 'other', 'unknown')),
  CONSTRAINT "analytics_path_check" CHECK ("path" ~ '^/[A-Za-z0-9/_-]*$')
);
--> statement-breakpoint
CREATE INDEX "analytics_page_views_time_idx" ON "analytics_page_views" ("occurred_at");
--> statement-breakpoint
CREATE INDEX "analytics_page_views_dimensions_idx" ON "analytics_page_views" ("locale", "country_code", "device_class");
--> statement-breakpoint
INSERT INTO "site_content" ("locale", "payload") VALUES
('es', $json$
{
  "language": "es",
  "navigation": { "home": "Inicio", "publications": "Publicaciones", "contact": "Contacto" },
  "home": {
    "eyebrow": "Portfolio",
    "title": "Construyo productos digitales claros y resistentes.",
    "introduction": "Este portfolio está tomando forma. Aquí aparecerán proyectos, decisiones técnicas y aprendizajes prácticos."
  },
  "publications": {
    "title": "Publicaciones",
    "introduction": "Notas sobre producto, ingeniería y la forma de construir sistemas mantenibles.",
    "items": [
      { "slug": "primeras-notas", "title": "Primeras notas", "summary": "Próximamente: una selección breve de artículos y casos de estudio.", "status": "coming-soon" }
    ]
  },
  "contact": {
    "title": "Contacto",
    "introduction": "Cuéntame qué quieres construir o mejorar.",
    "nameLabel": "Nombre",
    "emailLabel": "Correo electrónico",
    "messageLabel": "Mensaje",
    "submitLabel": "Enviar mensaje",
    "successMessage": "Mensaje recibido. Gracias por escribir."
  },
  "footer": { "note": "Portfolio personal. Contenido provisional." }
}
$json$::jsonb),
('en', $json$
{
  "language": "en",
  "navigation": { "home": "Home", "publications": "Publications", "contact": "Contact" },
  "home": {
    "eyebrow": "Portfolio",
    "title": "I build clear, resilient digital products.",
    "introduction": "This portfolio is taking shape. It will collect projects, technical decisions, and practical lessons."
  },
  "publications": {
    "title": "Publications",
    "introduction": "Notes on product, engineering, and building maintainable systems.",
    "items": [
      { "slug": "first-notes", "title": "First notes", "summary": "Coming soon: a concise selection of articles and case studies.", "status": "coming-soon" }
    ]
  },
  "contact": {
    "title": "Contact",
    "introduction": "Tell me what you would like to build or improve.",
    "nameLabel": "Name",
    "emailLabel": "Email",
    "messageLabel": "Message",
    "submitLabel": "Send message",
    "successMessage": "Message received. Thanks for reaching out."
  },
  "footer": { "note": "Personal portfolio. Placeholder content." }
}
$json$::jsonb);
