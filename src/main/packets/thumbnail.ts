import { ipcMain } from "electron";

import {
  getThumbnailUrl,
  clearThumbnailCache,
  getThumbnailCacheSize,
  isVideo,
  isImage,
  isAudio,
  supportsThumbnail,
  supportsMedia,
  type ThumbnailOptions,
} from "../protocols";

export const initThumbnailPackets = () => {
  ipcMain.handle(
    "thumbnail:getUrl",
    (_event, { id, options }: { id: string; options?: ThumbnailOptions }) => {
      return getThumbnailUrl(id, options);
    },
  );

  ipcMain.handle("thumbnail:clearCache", async () => {
    await clearThumbnailCache();
    return true;
  });

  ipcMain.handle("thumbnail:getCacheSize", async () => {
    return getThumbnailCacheSize();
  });

  ipcMain.handle(
    "thumbnail:isVideo",
    (_event, { filePath }: { filePath: string }) => {
      return isVideo(filePath);
    },
  );

  ipcMain.handle(
    "thumbnail:isImage",
    (_event, { filePath }: { filePath: string }) => {
      return isImage(filePath);
    },
  );

  ipcMain.handle(
    "thumbnail:isAudio",
    (_event, { filePath }: { filePath: string }) => {
      return isAudio(filePath);
    },
  );

  ipcMain.handle(
    "thumbnail:supports",
    (_event, { filePath }: { filePath: string }) => {
      return supportsThumbnail(filePath);
    },
  );

  ipcMain.handle(
    "media:supports",
    (_event, { filePath }: { filePath: string }) => {
      return supportsMedia(filePath);
    },
  );
};
