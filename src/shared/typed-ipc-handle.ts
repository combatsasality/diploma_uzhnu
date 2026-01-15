import { ipcMain, IpcMainInvokeEvent } from "electron";
import { IpcArgs, IpcChannel, IpcResult } from "shared";

export function handle<C extends IpcChannel>(
  channel: C,
  handler: (
    event: IpcMainInvokeEvent,
    ...args: IpcArgs<C>
  ) => Promise<IpcResult<C>> | IpcResult<C>
) {
  ipcMain.handle(channel, handler as any);
}
