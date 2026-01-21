import { initAPI } from "./api";
import { initProjectPackets } from "./project";
import { initProjectFilePackets } from "./project-file";

export const initPackets = () => {
  initProjectPackets();
  initProjectFilePackets();
  initAPI();
};
