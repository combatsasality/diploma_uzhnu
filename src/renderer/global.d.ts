import type { ProjectAPI } from "../main/preload";

declare global {
  interface Window {
    project: ProjectAPI;
  }
}

export {};
