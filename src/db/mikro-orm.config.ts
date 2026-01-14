import { Options } from "@mikro-orm/core";
import { SqliteDriver } from "@mikro-orm/sqlite";
import { Migrator } from "@mikro-orm/migrations";
import path from "node:path";
import { app } from "electron";
import { Project } from "./entities";

export function getOrmConfig(): Options<SqliteDriver> {
  const dbPath = path.join(app.getPath("userData"), "app.sqlite3");

  return {
    driver: SqliteDriver,
    dbName: dbPath,

    entities: [Project],

    extensions: [Migrator],
    
    // Explicitly disable knex to avoid sqlite3 conflicts
    debug: false,

    migrations: {
      path: "dist/db/migrations",
      pathTs: "src/db/migrations",
    },
  };
}
