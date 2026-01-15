import type { ProjectAPI, ProjectFileAPI } from "../main/preload";

declare global {
  interface Window {
    project: ProjectAPI;
    projectFile: ProjectFileAPI;
  }
}

export {};
