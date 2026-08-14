# Public edge

Nginx is the only public container. It serves the immutable frontend build on
port 8080 and proxies the supported API surface to `api:3000`. Prometheus,
Grafana, Alertmanager, Mailpit, PostgreSQL, and `/metrics` remain private.

The access log intentionally records only method, normalized `$uri`, status,
response size, and duration. Do not add client addresses, `$request_uri`,
referrers, or user agents. `X-Forwarded-For` is overwritten at this boundary;
deployments behind another edge must configure trusted real-IP handling there
before enabling country headers or changing this rule.

HSTS belongs at the real TLS terminator. The supplied CSP permits same-origin
assets and API calls; extend it narrowly when a concrete external asset is
introduced.

Validate without Compose:

```sh
docker run --rm --add-host api:127.0.0.1 \
  -v "$PWD/nginx/nginx.conf:/etc/nginx/nginx.conf:ro" \
  -v "$PWD/nginx/conf.d:/etc/nginx/conf.d:ro" \
  -v "$PWD/nginx/snippets:/etc/nginx/snippets:ro" \
  nginxinc/nginx-unprivileged:1.27-alpine nginx -t
```
