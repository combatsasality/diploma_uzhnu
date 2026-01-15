import { contextBridge, ipcRenderer } from "electron";
import { invoke } from "shared";

export const project = {
  getOrCreate: (args: { name: string }) =>
    invoke("prisma:project:getOrCreate", args),
};

export const projectFile = {
  create: (args: ProjectFile) => invoke("prisma:projectFile:create", args),
};

contextBridge.exposeInMainWorld("project", project);
contextBridge.exposeInMainWorld("projectFile", projectFile);

export type ProjectAPI = typeof project;
export type ProjectFileAPI = typeof projectFile;
