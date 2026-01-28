import { InferSelectModel } from "drizzle-orm";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { ProjectWithFiles } from "db";
import { projectFileTable } from "db";

export type ProjectFileWithMedia = InferSelectModel<typeof projectFileTable> & {
  mediaId: string;
  mediaUrl: string;
  thumbnailUrl?: string;
};

export type ProjectWithMedia = Omit<ProjectWithFiles, "files"> & {
  files: ProjectFileWithMedia[];
};

type ProjectContextValue = {
  project: ProjectWithMedia | null;
  setProject: (p: ProjectWithFiles | null) => Promise<void>;
  refresh: () => Promise<void>;
};

export const ProjectContext = createContext<ProjectContextValue | undefined>(
  undefined,
);

export const useProject = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error("useProject must be used within ProjectContext.Provider");
  }
  return ctx;
};

const registerMediaUrls = async (
  project: ProjectWithFiles,
): Promise<ProjectWithMedia> => {
  const filesWithMedia = await Promise.all(
    project.files.map(async (file) => {
      const mediaId = await window.media.register(file.absolutePath);
      const mediaUrl = await window.media.getUrl(mediaId);

      const isVisual =
        file.mimeType.startsWith("image/") ||
        file.mimeType.startsWith("video/");

      const thumbnailUrl = isVisual
        ? await window.thumbnail.getUrl(mediaId, { width: 480, height: 270 })
        : undefined;

      return { ...file, mediaId, mediaUrl, thumbnailUrl };
    }),
  );

  return { ...project, files: filesWithMedia };
};

export const ProjectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [project, setProjectState] = useState<ProjectWithMedia | null>(null);

  const setProject = useCallback(async (p: ProjectWithFiles | null) => {
    if (p) {
      const projectWithMedia = await registerMediaUrls(p);
      setProjectState(projectWithMedia);
    } else {
      setProjectState(null);
    }
  }, []);

  const refresh = useCallback(async () => {
    if (project) {
      const freshProject = await window.project.get({ id: project.id });
      await setProject(freshProject);
    }
  }, [project, setProject]);

  const value = useMemo(
    () => ({ project, setProject, refresh }),
    [project, setProject, refresh],
  );

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};
