import type { SiteContent } from "@portfolio/contracts";
import {
  bigint,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const siteContent = pgTable("site_content", {
  locale: varchar("locale", { length: 2 }).primaryKey(),
  payload: jsonb("payload").$type<SiteContent>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 254 }).notNull(),
  message: text("message").notNull(),
  locale: varchar("locale", { length: 2 }).notNull(),
});

export const contactOutbox = pgTable(
  "contact_outbox",
  {
    id: uuid("id").primaryKey(),
    contactId: uuid("contact_id").notNull().references(() => contactMessages.id, { onDelete: "cascade" }),
    status: varchar("status", { length: 16 }).notNull().default("pending"),
    attempts: integer("attempts").notNull().default(0),
    availableAt: timestamp("available_at", { withTimezone: true }).notNull().defaultNow(),
    lockedAt: timestamp("locked_at", { withTimezone: true }),
    lockedBy: varchar("locked_by", { length: 100 }),
    lastErrorCode: varchar("last_error_code", { length: 80 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    sentAt: timestamp("sent_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("contact_outbox_contact_id_idx").on(table.contactId),
    index("contact_outbox_dispatch_idx").on(table.status, table.availableAt),
  ],
);

export const contactRateLimits = pgTable(
  "contact_rate_limits",
  {
    visitorKey: varchar("visitor_key", { length: 32 }).notNull(),
    windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
    attempts: integer("attempts").notNull().default(1),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.visitorKey, table.windowStart] })],
);

export const analyticsPageViews = pgTable(
  "analytics_page_views",
  {
    id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
    path: varchar("path", { length: 256 }).notNull(),
    locale: varchar("locale", { length: 2 }).notNull(),
    countryCode: varchar("country_code", { length: 2 }).notNull().default("ZZ"),
    deviceClass: varchar("device_class", { length: 16 }).notNull(),
    userAgentFamily: varchar("user_agent_family", { length: 16 }).notNull(),
    visitorDayHash: varchar("visitor_day_hash", { length: 32 }).notNull(),
  },
  (table) => [
    index("analytics_page_views_time_idx").on(table.occurredAt),
    index("analytics_page_views_dimensions_idx").on(table.locale, table.countryCode, table.deviceClass),
  ],
);
