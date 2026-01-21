import { drizzleDB, projectFileTable } from "db";
import { eq, InferInsertModel, InferSelectModel } from "drizzle-orm";
import { ipcMain } from "electron";

export const initProjectFilePackets = () => {
  ipcMain.handle(
    "drizzle:projectFile:create",
    (
      _event,
      payload: InferInsertModel<typeof projectFileTable>,
    ): InferSelectModel<typeof projectFileTable> => {
      return drizzleDB.transaction((tx) => {
        const projectFile = tx
          .insert(projectFileTable)
          .values(payload)
          .returning()
          .get();

        if (!projectFile) throw new Error("Failed to create Project File");
        return projectFile;
      });
    },
  );
};
