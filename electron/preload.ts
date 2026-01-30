import { contextBridge, ipcRenderer } from 'electron';

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('api', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;

    const wrapper = (event: Electron.IpcRendererEvent, ...args: Parameters<typeof ipcRenderer.on>) => {
      listener(event, ...args);
    };

    ipcRenderer.on(channel, wrapper);

    return () => {
      ipcRenderer.off(channel, wrapper);
    };
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },
});
