import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../generated/prisma/client";
import path from "path";
import { app } from "electron";
import fs from "fs";

export let prisma: PrismaClient;

function copyDatabase(userDbPath: string) {
  if (fs.existsSync(userDbPath)) {
    return;
  }

  const bundledDbPath = app.isPackaged
    ? path.join(process.resourcesPath, "public/prisma", "example.db")
    : path.join(app.getAppPath(), "public/prisma", "example.db");

  fs.mkdirSync(path.dirname(userDbPath), { recursive: true });
  fs.copyFileSync(bundledDbPath, userDbPath);
}

export const initORM = async () => {
  const dbPath = path.join(app.getPath("userData"), "user.db");

  // TODO: add prisma runtime migration

  copyDatabase(dbPath);

  const adapter = new PrismaBetterSqlite3({
    url: `file:${dbPath}`,
  });

  prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
    adapter,
  });
};
