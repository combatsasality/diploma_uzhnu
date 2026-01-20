import { Migrator } from "@mikro-orm/migrations";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";

import { ReflectMetadataProvider } from "@mikro-orm/core";
import { BetterSqliteDriver, defineConfig } from "@mikro-orm/better-sqlite";

const config = defineConfig({
  driver: BetterSqliteDriver,
  metadataProvider: ReflectMetadataProvider,
  highlighter: new SqlHighlighter(),
  extensions: [Migrator],
  debug: true,
});

export default config;
