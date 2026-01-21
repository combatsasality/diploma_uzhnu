import { sqliteTable } from "drizzle-orm/sqlite-core";
import { defaultFields } from "./default-fields";

export const projectTable = sqliteTable("projects", (s) => ({
  ...defaultFields,
  name: s.text().unique().notNull(),
}));
