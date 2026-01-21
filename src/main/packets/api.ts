import { ipcMain } from "electron";
import fs from "node:fs";

export const initAPI = () => {
  ipcMain.handle("api:file:read", (_e, path: string) => {
    return fs.readFileSync(path);
  });
};
