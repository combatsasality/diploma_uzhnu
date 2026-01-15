import { prisma } from "db";
import { handle } from "shared";

export const initProjectPackets = () => {
  // Get or Create
  handle(
    "prisma:project:getOrCreate",
    async (
      _event,
      payload: {
        name: string;
      }
    ) => {
      const project = await prisma.project.upsert({
        where: { name: payload.name },
        update: {},
        create: { name: payload.name },
        include: { files: true },
      });
      return project as Project;
    }
  );
};
