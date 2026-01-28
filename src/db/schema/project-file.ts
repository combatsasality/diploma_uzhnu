import { index, sqliteTable } from "drizzle-orm/sqlite-core";

import { projectTable } from "./project";
import { defaultFields } from "./default-fields";

export const projectFileTable = sqliteTable(
  "projectFile",
  (s) => ({
    ...defaultFields,
    projectId: s
      .text()
      .notNull()
      .references(() => projectTable.id, { onDelete: "cascade" }),
    absolutePath: s.text().notNull(),
    filename: s.text().notNull(),
    mimeType: s.text().notNull(),
    size: s.integer().notNull(),
  }),
  (t) => [index("project_file_project_id_idx").on(t.projectId)],
);
