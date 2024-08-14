interface Window {
  api: {
    receive: (channel: string, callback: (data: any) => void) => void;
    invoke: (channel: string, data?: any) => Promise<any>;
    send: (channel: string, data?: any) => void;
    remove: (channel: string) => void;
    removeAllListeners: (channel: string) => void;
  };
}

window.api = window.api || {};

declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";
