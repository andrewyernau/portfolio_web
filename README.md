# Portfolio platform

This repository is a production-shaped foundation for a personal portfolio whose final content and visual identity are still evolving. It keeps the public site easy to redesign while giving contact delivery, data ownership, observability, and recovery first-class boundaries from day one.

## System shape

The browser reaches only Nginx. Nginx serves the compiled React application and forwards the supported `/api` surface to a Bun/Hono service. PostgreSQL stores content, contact delivery state, and coarse first-party analytics. The worker delivers accepted contact messages through SMTP without making the visitor wait for the mail provider.

Operational telemetry stays on a private Compose network. Prometheus owns time-series collection, Grafana owns visualization, and Alertmanager owns alert routing. Mailpit is the safe local SMTP target for both contact mail and alerts.

The detailed implementation ladder and its architectural invariants live in [the foundation spec](specs/portfolio-foundation/README.md).

## Local use

Install Bun 1.3+ and Docker Compose, copy `.env.example` to `.env`, and replace the `CHANGE_ME` values. Then install and verify the TypeScript workspace:

```sh
bun install
bun run check
```

Start the full local stack:

```sh
docker compose up --build --wait
```

The public site is on `http://localhost:8080`. Grafana, Prometheus, and Mailpit bind to localhost on the ports declared in `.env.example`; they are intentionally not reachable through Nginx. Swagger is available below the API prefix while development documentation is enabled.

Backups are opt-in because a local bind mount is not a production backup destination:

```sh
docker compose --profile ops up -d backup
```

Use the restore drill under `infra/backup` before trusting a backup. Production still needs an external encrypted destination, tested retention, and an owner for restore decisions.

## Privacy and security boundary

Analytics collect no cookies, raw IP addresses, raw user-agent strings, query strings, or persistent visitor identifier. Daily network-derived HMACs are still pseudonymous data, not anonymous data. A real launch therefore needs a transparent privacy notice, a justified legal basis, and retention values that match the stated purpose. Contact details have their own purpose and lifecycle.

Production must replace all local secrets, terminate TLS at a declared edge, restrict trusted proxy headers, and choose a deployment target. CI deliberately builds and publishes artifacts without pretending those unresolved choices have been made.
