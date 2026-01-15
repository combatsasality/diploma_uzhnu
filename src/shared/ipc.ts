export type IpcHandlers = {
  "prisma:project:getOrCreate": {
    args: [{ name: string }];
    result: { id: string; name: string };
  };
};

export type IpcChannel = keyof IpcHandlers;

export type IpcArgs<C extends IpcChannel> = IpcHandlers[C]["args"];
export type IpcResult<C extends IpcChannel> = IpcHandlers[C]["result"];
