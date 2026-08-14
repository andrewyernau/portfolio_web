ARG BUN_IMAGE=oven/bun:1.3.8-alpine
ARG NGINX_IMAGE=nginxinc/nginx-unprivileged:1.27-alpine

FROM ${BUN_IMAGE} AS frontend-build
WORKDIR /workspace

COPY package.json bun.lock ./
COPY api/package.json api/package.json
COPY frontend/package.json frontend/package.json
COPY packages/contracts/package.json packages/contracts/package.json
RUN bun install --frozen-lockfile

COPY frontend frontend
COPY packages/contracts packages/contracts
RUN cd frontend && bun run build

FROM ${NGINX_IMAGE}
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/snippets /etc/nginx/snippets
COPY --from=frontend-build /workspace/frontend/dist /usr/share/nginx/html

EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz >/dev/null || exit 1
