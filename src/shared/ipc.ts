export type IpcHandlers = {
  "prisma:project:getOrCreate": {
    args: [{ name: string }];
    result: Project;
  };
  "prisma:projectFile:create": {
    args: [ProjectFile];
    result: ProjectFile;
  };
};

export type IpcChannel = keyof IpcHandlers;

export type IpcArgs<C extends IpcChannel> = IpcHandlers[C]["args"];
export type IpcResult<C extends IpcChannel> = IpcHandlers[C]["result"];
