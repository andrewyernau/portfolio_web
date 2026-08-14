# Monitoring

Prometheus scrapes the private API endpoint and `postgres-exporter`. Grafana is
provisioned with one immutable Prometheus datasource and an operations
dashboard. Alertmanager owns alert delivery; its checked-in configuration sends
credential-free local mail to Mailpit.

HTTP metric dimensions are deliberately bounded. Never use a raw URL, query
string, IP, user agent, country, email, or request ID as a label. Metric names
and labels are owned by `api/src/metrics.ts`; dashboards and rules consume that
source rather than defining a parallel contract.

The production Alertmanager example is intentionally non-runnable. Render real
addresses outside source control, mount the SMTP password as the referenced
secret file, and replace the local config at deployment time.

Configuration gates:

```sh
docker run --rm -v "$PWD/monitor/prometheus:/etc/prometheus:ro" \
  prom/prometheus promtool check config /etc/prometheus/prometheus.yml
docker run --rm -v "$PWD/monitor/prometheus/rules:/work:ro" -w /work \
  prom/prometheus promtool test rules portfolio.test.yml
docker run --rm -v "$PWD/monitor/alertmanager:/etc/alertmanager:ro" \
  prom/alertmanager amtool check-config /etc/alertmanager/alertmanager.yml
```
