ARG NGINX_IMAGE=nginxinc/nginx-unprivileged:1.27-alpine

FROM ${NGINX_IMAGE}
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/snippets /etc/nginx/snippets
COPY static /usr/share/nginx/html/static
COPY static/main.pdf /usr/share/nginx/html/main.pdf

EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz >/dev/null || exit 1
