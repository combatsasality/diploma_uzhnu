import { text, integer } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";

export const defaultFields = {
  id: text()
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`),
};
