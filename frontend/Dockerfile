# Build from the repository root: docker build -f frontend/Dockerfile .
ARG BUN_VERSION=1.3.8
FROM oven/bun:${BUN_VERSION}-alpine AS build

WORKDIR /workspace
COPY package.json bun.lock ./
COPY api/package.json ./api/package.json
COPY packages/contracts/package.json ./packages/contracts/package.json
COPY frontend/package.json ./frontend/package.json
RUN bun install --frozen-lockfile

COPY packages/contracts ./packages/contracts
COPY frontend ./frontend
RUN bun --filter @portfolio/frontend build

# Export with: docker build --target artifacts --output type=local,dest=./dist .
# The Nginx image can also COPY the files from this stage.
FROM scratch AS artifacts
COPY --from=build /workspace/frontend/dist /
