import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawn } from "node:child_process";

import { app } from "electron";
import ffmpegPath from "ffmpeg-static";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ThumbnailOptions {
  width?: number;
  height?: number;
  timestamp?: number; // seconds
}

interface MediaEntry {
  absPath: string;
  mtime: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const THUMBNAIL_CACHE_DIR = path.join(app.getPath("userData"), "thumbnails");
const MAX_MEMORY_CACHE_SIZE = 100;
const DEFAULT_WIDTH = 320;
const DEFAULT_HEIGHT = 180;
const DEFAULT_TIMESTAMP = 1;

// ─────────────────────────────────────────────────────────────────────────────
// Cache
// ─────────────────────────────────────────────────────────────────────────────

const memoryCache = new Map<string, Buffer>();

// ─────────────────────────────────────────────────────────────────────────────
// File Type Detection
// ─────────────────────────────────────────────────────────────────────────────

const VIDEO_EXTENSIONS = new Set([
  ".mp4",
  ".webm",
  ".mkv",
  ".mov",
  ".avi",
  ".wmv",
  ".flv",
  ".m4v",
  ".3gp",
  ".ogv",
]);

const IMAGE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".bmp",
  ".tiff",
  ".tif",
]);

const AUDIO_EXTENSIONS = new Set([
  ".mp3",
  ".wav",
  ".ogg",
  ".m4a",
  ".flac",
  ".aac",
  ".wma",
]);

export const isVideo = (filePath: string): boolean => {
  return VIDEO_EXTENSIONS.has(path.extname(filePath).toLowerCase());
};

export const isImage = (filePath: string): boolean => {
  return IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase());
};

export const isAudio = (filePath: string): boolean => {
  return AUDIO_EXTENSIONS.has(path.extname(filePath).toLowerCase());
};

export const supportsThumbnail = (filePath: string): boolean => {
  return isVideo(filePath) || isImage(filePath);
};

export const supportsMedia = (filePath: string): boolean => {
  return isVideo(filePath) || isImage(filePath) || isAudio(filePath);
};

// ─────────────────────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────────────────────

const generateCacheKey = (
  absPath: string,
  mtime: number,
  options: Required<ThumbnailOptions>,
): string => {
  const data = `${absPath}:${mtime}:${options.width}:${options.height}:${options.timestamp}`;
  return crypto.createHash("sha256").update(data).digest("hex").slice(0, 24);
};

const ensureCacheDir = async (): Promise<void> => {
  try {
    await fs.promises.mkdir(THUMBNAIL_CACHE_DIR, { recursive: true });
  } catch {
    // Directory already exists
  }
};

const addToMemoryCache = (key: string, buffer: Buffer): void => {
  if (memoryCache.size >= MAX_MEMORY_CACHE_SIZE) {
    const firstKey = memoryCache.keys().next().value;
    if (firstKey) memoryCache.delete(firstKey);
  }
  memoryCache.set(key, buffer);
};

// ─────────────────────────────────────────────────────────────────────────────
// Thumbnail Generation
// ─────────────────────────────────────────────────────────────────────────────

const generateVideoThumbnail = (
  inputPath: string,
  options: Required<ThumbnailOptions>,
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    if (!ffmpegPath) {
      reject(new Error("ffmpeg-static not available"));
      return;
    }

    const args = [
      "-ss",
      String(options.timestamp),
      "-i",
      inputPath,
      "-vframes",
      "1",
      "-vf",
      `scale=${options.width}:${options.height}:force_original_aspect_ratio=decrease,pad=${options.width}:${options.height}:(ow-iw)/2:(oh-ih)/2:color=black`,
      "-f",
      "image2pipe",
      "-vcodec",
      "mjpeg",
      "-q:v",
      "5",
      "-",
    ];

    const chunks: Buffer[] = [];
    const ffmpeg = spawn(ffmpegPath, args);

    ffmpeg.stdout.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    ffmpeg.stderr.on("data", () => {
      // Ignore ffmpeg stderr (progress info)
    });

    ffmpeg.on("close", (code) => {
      if (code === 0 && chunks.length > 0) {
        resolve(Buffer.concat(chunks));
      } else {
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });

    ffmpeg.on("error", reject);
  });
};

const generateImageThumbnail = (
  inputPath: string,
  options: Required<ThumbnailOptions>,
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    if (!ffmpegPath) {
      reject(new Error("ffmpeg-static not available"));
      return;
    }

    const args = [
      "-i",
      inputPath,
      "-vf",
      `scale=${options.width}:${options.height}:force_original_aspect_ratio=decrease`,
      "-f",
      "image2pipe",
      "-vcodec",
      "mjpeg",
      "-q:v",
      "5",
      "-",
    ];

    const chunks: Buffer[] = [];
    const ffmpeg = spawn(ffmpegPath, args);

    ffmpeg.stdout.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    ffmpeg.stderr.on("data", () => {
      // Ignore ffmpeg stderr
    });

    ffmpeg.on("close", (code) => {
      if (code === 0 && chunks.length > 0) {
        resolve(Buffer.concat(chunks));
      } else {
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });

    ffmpeg.on("error", reject);
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

export const getThumbnail = async (
  entry: MediaEntry,
  options: ThumbnailOptions = {},
): Promise<Buffer> => {
  const normalizedOptions: Required<ThumbnailOptions> = {
    width: options.width || DEFAULT_WIDTH,
    height: options.height || DEFAULT_HEIGHT,
    timestamp: options.timestamp || DEFAULT_TIMESTAMP,
  };

  const cacheKey = generateCacheKey(
    entry.absPath,
    entry.mtime,
    normalizedOptions,
  );

  // Check memory cache
  const memoryCached = memoryCache.get(cacheKey);
  if (memoryCached) return memoryCached;

  // Check disk cache
  await ensureCacheDir();
  const cachePath = path.join(THUMBNAIL_CACHE_DIR, `${cacheKey}.jpg`);

  try {
    const diskCached = await fs.promises.readFile(cachePath);
    addToMemoryCache(cacheKey, diskCached);
    return diskCached;
  } catch {
    // Not in disk cache, generate
  }

  // Generate thumbnail
  let buffer: Buffer;

  if (isVideo(entry.absPath)) {
    buffer = await generateVideoThumbnail(entry.absPath, normalizedOptions);
  } else if (isImage(entry.absPath)) {
    buffer = await generateImageThumbnail(entry.absPath, normalizedOptions);
  } else {
    throw new Error("Unsupported file type for thumbnail");
  }

  // Save to disk cache (non-blocking)
  fs.promises.writeFile(cachePath, buffer).catch(() => {});

  // Add to memory cache
  addToMemoryCache(cacheKey, buffer);

  return buffer;
};

export const getThumbnailUrl = (
  id: string,
  options?: ThumbnailOptions,
): string => {
  const params = new URLSearchParams();
  if (options?.width) params.set("w", String(options.width));
  if (options?.height) params.set("h", String(options.height));
  if (options?.timestamp) params.set("t", String(options.timestamp));

  const query = params.toString();
  return `app://thumbnail/${id}${query ? `?${query}` : ""}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// Protocol Handler
// ─────────────────────────────────────────────────────────────────────────────

export const handleThumbnailRequest = async (
  request: Request,
  getEntry: (id: string) => MediaEntry | undefined,
): Promise<Response> => {
  const url = new URL(request.url);
  const id = url.pathname.replace(/^\//, "");

  const entry = getEntry(id);
  if (!entry) {
    return new Response("Media not found", { status: 404 });
  }

  const options: ThumbnailOptions = {
    width: url.searchParams.has("w")
      ? Number(url.searchParams.get("w"))
      : undefined,
    height: url.searchParams.has("h")
      ? Number(url.searchParams.get("h"))
      : undefined,
    timestamp: url.searchParams.has("t")
      ? Number(url.searchParams.get("t"))
      : undefined,
  };

  try {
    const thumbnail = await getThumbnail(entry, options);

    return new Response(new Uint8Array(thumbnail), {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Length": String(thumbnail.length),
        "Cache-Control": "private, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Thumbnail generation failed:", error);
    return new Response("Failed to generate thumbnail", { status: 500 });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Cache Management
// ─────────────────────────────────────────────────────────────────────────────

export const clearThumbnailCache = async (): Promise<void> => {
  memoryCache.clear();

  try {
    const files = await fs.promises.readdir(THUMBNAIL_CACHE_DIR);
    await Promise.all(
      files.map((file) =>
        fs.promises
          .unlink(path.join(THUMBNAIL_CACHE_DIR, file))
          .catch(() => {}),
      ),
    );
  } catch {
    // Directory doesn't exist
  }
};

export const getThumbnailCacheSize = async (): Promise<number> => {
  try {
    const files = await fs.promises.readdir(THUMBNAIL_CACHE_DIR);
    let totalSize = 0;

    for (const file of files) {
      const stat = await fs.promises.stat(path.join(THUMBNAIL_CACHE_DIR, file));
      totalSize += stat.size;
    }

    return totalSize;
  } catch {
    return 0;
  }
};
