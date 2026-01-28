import { ipcMain } from "electron";

import {
  registerMediaPath,
  registerMediaPathSync,
  unregisterMediaPath,
  getMediaUrl,
} from "../protocols";

export const initMediaProtocolPackets = () => {
  ipcMain.handle(
    "media:register",
    async (_event, { absPath }: { absPath: string }) => {
      return registerMediaPath(absPath);
    },
  );

  ipcMain.handle(
    "media:registerSync",
    (_event, { absPath }: { absPath: string }) => {
      return registerMediaPathSync(absPath);
    },
  );

  ipcMain.handle("media:unregister", (_event, { id }: { id: string }) => {
    return unregisterMediaPath(id);
  });

  ipcMain.handle("media:getUrl", (_event, { id }: { id: string }) => {
    return getMediaUrl(id);
  });
};
