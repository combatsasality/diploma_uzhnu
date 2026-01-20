import { defineConfig, Options } from "@mikro-orm/core";

import sharedConfig from "./mikro-orm-shared.config";
import { BetterSqliteDriver } from "@mikro-orm/better-sqlite";

const config = defineConfig<BetterSqliteDriver>({
  dbName: "database.sqlite",
  ...sharedConfig,
  entities: ["./src/db/entities/*.entity.ts"],
  migrations: {
    pathTs: "./src/db/migrations",
  },
});

export default config;
