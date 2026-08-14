import { Counter, Gauge, Histogram, Registry, collectDefaultMetrics } from "prom-client";

export const registry = new Registry();
collectDefaultMetrics({ register: registry, prefix: "portfolio_" });

export const httpRequests = new Counter({
  name: "portfolio_http_requests_total",
  help: "HTTP requests handled by the API",
  labelNames: ["method", "route", "status_class"] as const,
  registers: [registry],
});
export const httpDuration = new Histogram({
  name: "portfolio_http_request_duration_seconds",
  help: "HTTP request duration",
  labelNames: ["method", "route"] as const,
  buckets: [0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [registry],
});
export const inFlight = new Gauge({
  name: "portfolio_http_requests_in_flight",
  help: "HTTP requests currently in flight",
  registers: [registry],
});
export const contactAccepted = new Counter({
  name: "portfolio_contact_accepted_total",
  help: "Contact requests accepted into the transactional outbox",
  registers: [registry],
});
export const outboxMessages = new Gauge({
  name: "portfolio_outbox_messages",
  help: "Current contact outbox messages by bounded delivery status",
  labelNames: ["status"] as const,
  registers: [registry],
});
export const pageViews = new Counter({
  name: "portfolio_page_views_accepted_total",
  help: "Privacy-preserving page views accepted",
  labelNames: ["locale", "device"] as const,
  registers: [registry],
});
