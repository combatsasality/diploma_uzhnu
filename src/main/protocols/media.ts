import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

import {
  ThumbnailOptions,
  getThumbnailUrl as _getThumbnailUrl,
} from "./thumbnail";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface MediaEntry {
  absPath: string;
  mtime: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────────────

const mediaRegistry = new Map<string, MediaEntry>();

// ─────────────────────────────────────────────────────────────────────────────
// MIME Types
// ─────────────────────────────────────────────────────────────────────────────

const MIME_TYPES: Record<string, string> = {
  // Video
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mkv": "video/x-matroska",
  ".mov": "video/quicktime",
  ".avi": "video/x-msvideo",
  ".wmv": "video/x-ms-wmv",
  ".flv": "video/x-flv",
  ".m4v": "video/x-m4v",
  ".3gp": "video/3gpp",
  ".ogv": "video/ogg",
  // Audio
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".m4a": "audio/mp4",
  ".flac": "audio/flac",
  ".aac": "audio/aac",
  ".wma": "audio/x-ms-wma",
  // Image
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".bmp": "image/bmp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".tiff": "image/tiff",
  ".tif": "image/tiff",
};

const getMimeType = (filePath: string): string => {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
};

// ─────────────────────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────────────────────

const generateId = (absPath: string): string => {
  return crypto.createHash("sha256").update(absPath).digest("hex").slice(0, 16);
};

const parseRangeHeader = (
  range: string | null,
  fileSize: number,
): { start: number; end: number } | null => {
  if (!range) return null;

  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match) return null;

  const start = match[1] ? Number(match[1]) : 0;
  const end = match[2] ? Number(match[2]) : fileSize - 1;

  if (start > end || start >= fileSize || end >= fileSize) {
    return null;
  }

  return { start, end };
};

// ─────────────────────────────────────────────────────────────────────────────
// File Registration
// ─────────────────────────────────────────────────────────────────────────────

export const registerMediaPath = async (absPath: string): Promise<string> => {
  const stat = await fs.promises.stat(absPath);
  const id = generateId(absPath);

  mediaRegistry.set(id, {
    absPath,
    mtime: stat.mtimeMs,
  });

  return id;
};

export const registerMediaPathSync = (absPath: string): string => {
  const stat = fs.statSync(absPath);
  const id = generateId(absPath);

  mediaRegistry.set(id, {
    absPath,
    mtime: stat.mtimeMs,
  });

  return id;
};

export const unregisterMediaPath = (id: string): boolean => {
  return mediaRegistry.delete(id);
};

export const getMediaEntry = (id: string): MediaEntry | undefined => {
  return mediaRegistry.get(id);
};

export const getMediaUrl = (id: string): string => {
  return `app://media/${id}`;
};

export const getThumbnailUrl = (
  id: string,
  options?: ThumbnailOptions,
): string => {
  return _getThumbnailUrl(id, options);
};

// ─────────────────────────────────────────────────────────────────────────────
// Protocol Handler
// ─────────────────────────────────────────────────────────────────────────────

export const handleMediaRequest = async (
  request: Request,
): Promise<Response> => {
  const url = new URL(request.url);
  const id = url.pathname.replace(/^\//, "");

  const entry = mediaRegistry.get(id);
  if (!entry) {
    return new Response("Media not found", { status: 404 });
  }

  let stat: fs.Stats;
  try {
    stat = await fs.promises.stat(entry.absPath);
    if (!stat.isFile()) {
      return new Response("Not a file", { status: 404 });
    }
  } catch {
    return new Response("File not found", { status: 404 });
  }

  const fileSize = stat.size;
  const mimeType = getMimeType(entry.absPath);
  const rangeInfo = parseRangeHeader(request.headers.get("range"), fileSize);

  // Full file response
  if (!rangeInfo) {
    const stream = fs.createReadStream(entry.absPath);
    return new Response(stream as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": String(fileSize),
        "Accept-Ranges": "bytes",
        "Cache-Control": "private, max-age=3600",
      },
    });
  }

  // Partial content response (range request)
  const { start, end } = rangeInfo;
  const contentLength = end - start + 1;
  const stream = fs.createReadStream(entry.absPath, { start, end });

  return new Response(stream as unknown as BodyInit, {
    status: 206,
    headers: {
      "Content-Type": mimeType,
      "Content-Length": String(contentLength),
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, max-age=3600",
    },
  });
};
