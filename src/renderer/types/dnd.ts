export enum TypeDND {
  FILE = "file",
}

export interface FileWithUrls {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  absolutePath: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
}
