type ProjectFile = {
  id: string;
  projectId: string;
  path: string;
  filename?: string;
  mimeType?: string;
  size?: number;
};

type Project = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  files: ProjectFile[];
};

type ProjectWithoutFiles = Omit<Project, "files">;
