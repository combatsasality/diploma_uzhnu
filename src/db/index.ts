import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import { app } from "electron";
import path from "path";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema";
import * as relations from "./relations";

const schemaWithRelations = {
  ...schema,
  ...relations,
};

export let drizzleDB: BetterSQLite3Database<typeof schemaWithRelations>;
export * from "./schema";
export * from "./relations";

export const initializeDatabase = () => {
  const dbPath = path.join(app.getPath("userData"), "app_database.sqlite");

  drizzleDB = drizzle(dbPath, {
    schema: schemaWithRelations,
  });
  migrate(drizzleDB, {
    migrationsFolder: path.join(app.getAppPath(), "./drizzle"),
  });
};
