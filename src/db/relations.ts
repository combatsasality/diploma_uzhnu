import { InferSelectModel, relations } from "drizzle-orm";
import { projectTable, projectFileTable } from "./schema";

export const projectRelations = relations(projectTable, ({ many }) => ({
  files: many(projectFileTable),
}));

export const projectFileRelations = relations(projectFileTable, ({ one }) => ({
  project: one(projectTable, {
    fields: [projectFileTable.projectId],
    references: [projectTable.id],
  }),
}));

export type Project = InferSelectModel<typeof projectTable>;

export type ProjectWithFiles = InferSelectModel<typeof projectTable> & {
  files: InferSelectModel<typeof projectFileTable>[];
}; // TODO: move to @types
