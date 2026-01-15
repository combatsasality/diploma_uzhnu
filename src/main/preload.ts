// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge } from "electron";
import { invoke } from "shared";

export const project = {
  getOrCreate: (args: { name: string }) =>
    invoke("prisma:project:getOrCreate", args),
};

contextBridge.exposeInMainWorld("project", project);

export type ProjectAPI = typeof project;
