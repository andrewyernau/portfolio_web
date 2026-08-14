# PostgreSQL ownership

The TypeScript schema in `api/src/db/schema.ts` is the sole owner of application tables. Generated, reviewable SQL migrations live in `postgres/migrations` and are applied with `bun run db:migrate` from `api`.

Bootstrap mechanisms may create database roles or extensions, but must not create application tables. The initial migration also inserts the replaceable Spanish and English placeholder content.
