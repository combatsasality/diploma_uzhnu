import { ipcRenderer } from "electron";
import type { IpcArgs, IpcChannel, IpcResult } from "shared";

export function invoke<C extends IpcChannel>(
  channel: C,
  ...args: IpcArgs<C>
): Promise<IpcResult<C>> {
  return ipcRenderer.invoke(channel, ...args);
}
