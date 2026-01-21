import type { ElectronAPI, ProjectAPI, ProjectFileAPI } from "../main/preload";

declare global {
  interface Window {
    project: ProjectAPI;
    projectFile: ProjectFileAPI;
    api: ElectronAPI;
  }
}

export {};
