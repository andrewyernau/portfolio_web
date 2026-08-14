import { migrate } from "drizzle-orm/postgres-js/migrator";
import { parseDatabaseConfig } from "../config";
import { createDatabase } from "./client";

const config = parseDatabaseConfig(process.env);
const { db, client } = createDatabase(config);

try {
  await migrate(db, { migrationsFolder: new URL("../../../postgres/migrations", import.meta.url).pathname });
  console.info(JSON.stringify({ event: "database_migrated" }));
} finally {
  await client.end();
}
