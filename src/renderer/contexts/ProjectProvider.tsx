import { ProjectWithFiles } from "db";
import React, { createContext, useContext, useMemo, useState } from "react";

type ProjectContextValue = {
  project: ProjectWithFiles | null;
  setProject: (p: ProjectWithFiles | null) => void;
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

export const ProjectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [project, setProject] = useState<ProjectWithFiles | null>(null);

  const refresh = async () => {
    if (project) {
      const freshProject = await window.project.get({ id: project.id });

      setProject(freshProject);
    }
  };

  const value = useMemo(() => ({ project, setProject, refresh }), [project]);

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};
