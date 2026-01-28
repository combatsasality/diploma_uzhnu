import { protocol } from "electron";

import { handleMediaRequest, getMediaEntry } from "./media";
import { handleThumbnailRequest } from "./thumbnail";

// ─────────────────────────────────────────────────────────────────────────────
// Protocol Registration (call BEFORE app.ready)
// ─────────────────────────────────────────────────────────────────────────────

export const registerSchemes = (): void => {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: "app",
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        stream: true,
        corsEnabled: true,
        bypassCSP: true,
      },
    },
  ]);
};

// ─────────────────────────────────────────────────────────────────────────────
// Protocol Installation (call AFTER app.ready)
// ─────────────────────────────────────────────────────────────────────────────

export const installProtocols = (): void => {
  protocol.handle("app", async (request) => {
    const url = new URL(request.url);

    switch (url.hostname) {
      case "media":
        return handleMediaRequest(request);
      case "thumbnail":
        return handleThumbnailRequest(request, getMediaEntry);
      default:
        return new Response("Unknown protocol host", { status: 404 });
    }
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Re-exports
// ─────────────────────────────────────────────────────────────────────────────

export {
  registerMediaPath,
  registerMediaPathSync,
  unregisterMediaPath,
  getMediaEntry,
  getMediaUrl,
  getThumbnailUrl,
} from "./media";

export {
  getThumbnail,
  clearThumbnailCache,
  getThumbnailCacheSize,
  isVideo,
  isImage,
  isAudio,
  supportsThumbnail,
  supportsMedia,
  type ThumbnailOptions,
} from "./thumbnail";
