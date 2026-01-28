import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { contextBridge, ipcRenderer, webUtils } from "electron";

import { projectFileTable, ProjectWithFiles } from "db";

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

export const media = {
  register: (absPath: string): Promise<string> =>
    ipcRenderer.invoke("media:register", { absPath }),
  registerSync: (absPath: string): Promise<string> =>
    ipcRenderer.invoke("media:registerSync", { absPath }),
  unregister: (id: string): Promise<boolean> =>
    ipcRenderer.invoke("media:unregister", { id }),
  getUrl: (id: string): Promise<string> =>
    ipcRenderer.invoke("media:getUrl", { id }),
  supports: (filePath: string): Promise<boolean> =>
    ipcRenderer.invoke("media:supports", { filePath }),
};

export interface ThumbnailOptions {
  width?: number;
  height?: number;
  timestamp?: number;
}

export const thumbnail = {
  getUrl: (id: string, options?: ThumbnailOptions): Promise<string> =>
    ipcRenderer.invoke("thumbnail:getUrl", { id, options }),
  clearCache: (): Promise<boolean> =>
    ipcRenderer.invoke("thumbnail:clearCache"),
  getCacheSize: (): Promise<number> =>
    ipcRenderer.invoke("thumbnail:getCacheSize"),
  isVideo: (filePath: string): Promise<boolean> =>
    ipcRenderer.invoke("thumbnail:isVideo", { filePath }),
  isImage: (filePath: string): Promise<boolean> =>
    ipcRenderer.invoke("thumbnail:isImage", { filePath }),
  isAudio: (filePath: string): Promise<boolean> =>
    ipcRenderer.invoke("thumbnail:isAudio", { filePath }),
  supports: (filePath: string): Promise<boolean> =>
    ipcRenderer.invoke("thumbnail:supports", { filePath }),
};

export const api = {
  getAbsolutePath: (file: File): string => webUtils.getPathForFile(file),
};

contextBridge.exposeInMainWorld("project", project);
contextBridge.exposeInMainWorld("projectFile", projectFile);
contextBridge.exposeInMainWorld("media", media);
contextBridge.exposeInMainWorld("thumbnail", thumbnail);
contextBridge.exposeInMainWorld("api", api);

export type ProjectAPI = typeof project;
export type ProjectFileAPI = typeof projectFile;
export type MediaAPI = typeof media;
export type ThumbnailAPI = typeof thumbnail;
export type ElectronAPI = typeof api;
