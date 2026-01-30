export {};

declare global {
  interface Window {
    api: {
      on: (...args: Parameters<Electron.IpcRenderer['on']>) => () => void;
      send: (...args: Parameters<Electron.IpcRenderer['send']>) => void;
      invoke: <T>(...args: Parameters<Electron.IpcRenderer['invoke']>) => Promise<T>;
    };
  }
}
