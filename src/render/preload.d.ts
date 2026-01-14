import { ElectronHandler } from "../main/preload";

declare global {
  interface Window {
    electron: ElectronHandler;
  }

  declare module "*.module.css" {
    const classes: { [key: string]: string };
    export default classes;
  }
}

export {};
