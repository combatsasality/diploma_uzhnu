declare global {
  interface Window {
    electron: ElectronHandler;
  }

  interface ElectronHandler {}

  declare module "*.module.css" {
    const classes: { [key: string]: string };
    export default classes;
  }
}

export {};
