# Slice 04 — Observability and data operations

Unlock API request/latency/error metrics, process and PostgreSQL signals, a provisioned Grafana dashboard, and actionable Alertmanager rules. Alerts cover API absence, sustained server errors, and high p95 latency. Mailpit receives local alerts; production SMTP remains secret-backed.

Verify Prometheus and Alertmanager configuration, bounded metric labels, scrape reachability, dashboard provisioning, and alert rule tests. Backups use `pg_dump` custom format, checksum, retention, and a documented restore drill. Creating a backup without proving restore is not acceptance.

