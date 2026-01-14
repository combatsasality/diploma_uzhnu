import { MikroORM } from "@mikro-orm/core";
import { SqliteDriver } from "@mikro-orm/sqlite";

import { getOrmConfig } from "./mikro-orm.config";

let orm: MikroORM<SqliteDriver> | null = null;

export async function initOrm() {
  if (orm) return orm;

  orm = await MikroORM.init<SqliteDriver>(getOrmConfig());

  await orm.migrator.up();

  return orm;
}

export function getOrm() {
  if (!orm) throw new Error("ORM is not initialized yet");
  return orm;
}
