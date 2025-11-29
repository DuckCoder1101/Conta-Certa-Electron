export {};

declare global {
	interface Window {
		api: {
			on: (...args: Parameters<Electron.IpcRenderer['on']>) => Electron.IpcRenderer;
			off: (...args: Parameters<Electron.IpcRenderer['off']>) => Electron.IpcRenderer;
			send: (...args: Parameters<Electron.IpcRenderer['send']>) => void;
			invoke: <T>(...args: Parameters<Electron.IpcRenderer['invoke']>) => Promise<T>;
    };
    
		bootstrap: {
			Modal: typeof import('bootstrap/js/dist/modal');
			Toast: typeof import('bootstrap/js/dist/toast');
			Tooltip: typeof import('bootstrap/js/dist/tooltip');
			Popover: typeof import('bootstrap/js/dist/popover');
		};
	}
}
