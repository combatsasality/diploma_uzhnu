import { projectFileTable, projectTable, ProjectWithFiles } from "db";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { contextBridge, ipcRenderer, webUtils } from "electron";

export const project = {
  getOrCreate: (args: { name: string }): Promise<ProjectWithFiles> =>
    ipcRenderer.invoke("drizzle:project:getOrCreate", args),
  get: (args: { id: string }): Promise<ProjectWithFiles> =>
    ipcRenderer.invoke("drizzle:project:get", args),
};

export const projectFile = {
  create: (
    args: InferInsertModel<typeof projectFileTable>,
  ): Promise<InferSelectModel<typeof projectFileTable>> =>
    ipcRenderer.invoke("drizzle:projectFile:create", args),
};

export const api = {
  getPathForFile: (file: File): string => webUtils.getPathForFile(file),
};

contextBridge.exposeInMainWorld("project", project);
contextBridge.exposeInMainWorld("projectFile", projectFile);
contextBridge.exposeInMainWorld("api", api);

export type ProjectAPI = typeof project;
export type ProjectFileAPI = typeof projectFile;
export type ElectronAPI = typeof api;
