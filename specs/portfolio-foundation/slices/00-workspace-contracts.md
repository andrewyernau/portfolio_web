# Slice 00 — Workspace and contracts

Unlock a reproducible Bun monorepo with strict TypeScript, one lockfile, shared public schemas, environment examples, and fast test/typecheck/build commands.

The seam is `packages/contracts`: contact, analytics, content, health, and error schemas are exported from one module. Human verification is `bun install`, `bun run typecheck`, and `bun test`. No service may copy these request shapes. Feedback changes this slice only if the package topology or API naming changes.

