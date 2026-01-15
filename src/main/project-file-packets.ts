import { prisma } from "db";
import { handle } from "shared";

export const initProjectFilePackets = () => {
  // Create Project File
  handle("prisma:projectFile:create", async (_event, payload: ProjectFile) => {
    const projectFile = await prisma.projectFile.create({
      data: {
        projectId: payload.projectId,
        path: payload.path,
        filename: payload.filename,
        mimeType: payload.mimeType,
        size: payload.size,
      },
    });
    return {
      id: projectFile.id,
      projectId: projectFile.projectId,
      path: projectFile.path,
      filename: projectFile.filename ?? undefined,
      mimeType: projectFile.mimeType ?? undefined,
      size: projectFile.size ?? undefined,
    } as ProjectFile;
  });
};
