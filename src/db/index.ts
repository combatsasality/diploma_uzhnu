import { MikroORM } from "@mikro-orm/core";
import { Options } from "@mikro-orm/core";
import { app } from "electron";
import path from "path";

import config from "./mikro-orm.config";
import { BetterSqliteDriver } from "@mikro-orm/better-sqlite";

export let orm: MikroORM<BetterSqliteDriver>;

export const initORM = async (): Promise<void> => {
  const dbPath = path.join(app.getPath("userData"), "database.sqlite");

  try {
    orm = await MikroORM.init<BetterSqliteDriver>({
      ...config,
      dbName: dbPath,
    } as Options<BetterSqliteDriver>);
  } catch (err: any) {
    console.log("=== error connecting to database ====", err.message);
    throw err;
  }
};
