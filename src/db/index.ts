import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../generated/prisma/client";
import path from "path";
import { app } from "electron";

export let prisma: PrismaClient;

export const initORM = () => {
  const dbPath = path.join(app.getPath("userData"), "user.db");

  const adapter = new PrismaBetterSqlite3({
    url: `file:${dbPath}`,
  });

  prisma = new PrismaClient({ adapter });
};
