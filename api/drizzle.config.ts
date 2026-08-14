import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "../postgres/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://invalid:invalid@localhost:5432/invalid",
  },
  strict: true,
  verbose: true,
});
