FROM oven/bun:1.3.14-alpine AS dependencies
WORKDIR /app

COPY package.json bunfig.toml bun.lock ./
COPY api/package.json api/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY frontend/package.json frontend/package.json
# Runtime containers execute from a workspace package. Bun 1.3.8 cannot
# resolve isolated-linker dependencies from that package after copying the
# dependency tree into a separate stage, so use a portable hoisted layout.
RUN bun install --frozen-lockfile --production --linker hoisted

FROM oven/bun:1.3.14-alpine AS runtime
WORKDIR /app
ENV APP_ENV=production

# Keep the workspace manifest and Bun configuration with the installed
# dependencies so local workspace packages resolve correctly at runtime.
COPY package.json bunfig.toml ./
COPY --from=dependencies /app/node_modules ./node_modules
COPY api ./api
COPY packages/contracts ./packages/contracts
COPY postgres/migrations ./postgres/migrations

WORKDIR /app/api
USER bun
EXPOSE 3000
CMD ["bun", "run", "start"]
