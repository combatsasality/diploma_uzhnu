import { getEntities, getMigrations } from "./utils/dynamic-imports";
import sharedConfig from "./mikro-orm-shared.config";
import { defineConfig } from "@mikro-orm/better-sqlite";
import type { MigrationObject } from "@mikro-orm/core";

const config = defineConfig({
  ...sharedConfig,
  entities: getEntities() as string[],
  migrations: {
    migrationsList: getMigrations() as MigrationObject[],
  },
});

export default config;
