import { initMediaProtocolPackets } from "./media-protocol";
import { initProjectPackets } from "./project";
import { initProjectFilePackets } from "./project-file";
import { initThumbnailPackets } from "./thumbnail";

export const initPackets = () => {
  initProjectPackets();
  initProjectFilePackets();
  initMediaProtocolPackets();
  initThumbnailPackets();
};
