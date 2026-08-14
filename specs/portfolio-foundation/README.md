# Portfolio foundation

## Next Agent Prompt

Status: MVP implementation completed locally on 2026-07-15; Docker runtime validation remains external. Pick up by installing Docker Compose, copying `.env.example` to `.env`, replacing local secrets, and running `docker compose up --build --wait`. Exercise contact delivery in Mailpit, inspect Prometheus targets/Grafana, then run the backup/restore drill. Do not introduce a second owner for API schemas, database schema, runtime configuration, or public routing. Before ending a pass, update this section and the checklist.

- [x] Slice 00: workspace and contracts
- [x] Slice 01: runnable vertical skeleton
- [x] Slice 02: content and reliable contact flow
- [x] Slice 03: privacy-preserving analytics
- [x] Slice 04: observability and data operations
- [x] Slice 05: CI, release hardening, and visual gate
- [ ] External gate: run the Compose stack, SMTP flow, Prometheus checks, and backup/restore drill on a Docker host

Current warnings: Docker/WSL are unavailable in the authoring environment, so Compose runtime checks require another machine. Real deployment, domain, TLS termination, SMTP credentials, backup target, legal text, and GitHub owner remain intentionally unbound. Git initialization is also left to the host because this sandbox cannot write `.git`.

## Goal

Build a production-shaped portfolio baseline that is useful before its final visual identity exists. A visitor can browse placeholder content in Spanish or English and submit a contact request. The owner gets durable delivery, coarse traffic signals, operational dashboards, alerts, and recoverable data.

## Architecture

The root is a Bun workspace. `frontend` builds a static React application. Nginx owns the public edge and proxies only the supported API surface. `api` owns HTTP behavior and background mail delivery. `packages/contracts` owns public validation schemas. Drizzle owns the PostgreSQL schema; generated SQL lives under `postgres/migrations`. Prometheus collects internal metrics, Grafana visualizes them, and Alertmanager owns operational email alerts.

Contact delivery uses a transactional outbox: accepting a message and scheduling its email are one database transaction. SMTP availability never determines API readiness. Mailpit is the credential-free local receiver; production SMTP is an external configuration.

Analytics are coarse and first-party. They do not use cookies, local storage, raw IPs, raw user agents, query strings, or cross-day identifiers. A daily HMAC of a truncated network prefix can estimate daily uniqueness but remains pseudonymous data and therefore has a retention limit and transparency requirement.

## Single-owner invariants

- Public request and response shapes have one owner: `packages/contracts`.
- PostgreSQL structure has one owner: the Drizzle schema; bootstrap SQL may create extensions or users, never application tables.
- Environment parsing has one owner per runtime and fails closed for unsafe production defaults.
- Nginx is the only public router. Metrics, databases, Grafana, Prometheus, Alertmanager, and Mailpit are internal or explicitly bound for local inspection.
- Prometheus labels are bounded; personal data and arbitrary URLs never become labels or logs.
- The frontend consumes API content and contracts instead of maintaining a parallel content model.

## Review map

The first browser checkpoint is slice 01. Slice 02 proves that a contact survives SMTP downtime. Slice 03 proves minimization with deterministic fixtures. Slice 04 is accepted only after configuration checks plus a backup/restore drill. Slice 05 closes with desktop/mobile screenshots and an unprimed screenshot critique.

The accepted screenshots are archived under `assets/`. An unprimed first review flagged clipping caused by Edge headless's Windows minimum viewport; a corrected emulation and CSS hardening produced complete navigation and clean wrapping. A second fresh review found no blocking desktop or mobile defect. It noted only a non-blocking stretch of whitespace before the mobile footer, retained because the shell deliberately keeps short pages full-height.

## Research basis

The implementation follows the official Bun workspace/container model, Drizzle's generated-migration workflow, Hono's Zod OpenAPI integration, and Alertmanager's SMTP configuration. GDPR Article 5 principles apply to the analytics design: purpose limitation, minimization, storage limitation, and security.
