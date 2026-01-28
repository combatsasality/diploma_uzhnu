import { eq } from "drizzle-orm";
import { ipcMain } from "electron";

import {
  drizzleDB,
  projectFileTable,
  projectTable,
  ProjectWithFiles,
} from "db";

export const initProjectPackets = () => {
  ipcMain.handle(
    "drizzle:project:getOrCreate",
    (_event, payload: { name: string }) => {
      return drizzleDB.transaction((tx) => {
        tx.insert(projectTable)
          .values({ name: payload.name })
          .onConflictDoNothing({ target: projectTable.name })
          .run();

        const project = tx
          .select()
          .from(projectTable)
          .where(eq(projectTable.name, payload.name))
          .get();

        if (!project) throw new Error("getOrCreate failed unexpectedly");

        const files = tx
          .select()
          .from(projectFileTable)
          .where(eq(projectFileTable.projectId, project.id))
          .all();

        return { ...project, files };
      });
    },
  );

  ipcMain.handle(
    "drizzle:project:get",
    async (_event, payload: { id: string }): Promise<ProjectWithFiles> => {
      const project = await drizzleDB.query.projectTable
        .findFirst({
          where: (p, { eq }) => eq(p.id, payload.id),
          with: { files: true },
        })
        .execute();

      if (!project) throw new Error("Project not found with given id");
      return project;
    },
  );
};
