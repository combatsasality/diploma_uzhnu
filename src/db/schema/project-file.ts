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
    absolutePath: s.text().notNull().unique(),
    filename: s.text(),
    mimeType: s.text(),
    size: s.integer(),
  }),
  (t) => [index("project_file_project_id_idx").on(t.projectId)],
);
