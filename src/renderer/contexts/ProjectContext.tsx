import React, { createContext, useContext, useMemo, useState } from "react";

type ProjectContextValue = {
  project: Project | null;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
};

export const ProjectContext = createContext<ProjectContextValue | undefined>(
  undefined
);

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error("useProject must be used within ProjectContext.Provider");
  }
  return ctx;
}

export const ProjectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [project, setProject] = useState<Project | null>(null);

  const value = useMemo(() => ({ project, setProject }), [project]);

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};
