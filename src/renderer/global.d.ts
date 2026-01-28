import type {
  ElectronAPI,
  MediaAPI,
  ProjectAPI,
  ProjectFileAPI,
  ThumbnailAPI,
} from "../main/preload";

declare global {
  interface Window {
    project: ProjectAPI;
    projectFile: ProjectFileAPI;
    api: ElectronAPI;
    media: MediaAPI;
    thumbnail: ThumbnailAPI;
  }
}

export {};
