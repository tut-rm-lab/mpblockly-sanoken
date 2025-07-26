import electron = require('electron');
const { contextBridge, ipcRenderer } = electron;

const electronAPI = {
  openFile: (file: string): Promise<string> =>
    ipcRenderer.invoke('open-file', file),
  saveFile: (file: string, data: string): Promise<void> =>
    ipcRenderer.invoke('save-file', file, data),
  showOpenDialog: (): Promise<string | null> =>
    ipcRenderer.invoke('show-open-dialog'),
  showSaveDialog: (): Promise<string | null> =>
    ipcRenderer.invoke('show-save-dialog'),
  showInfoDialog: (message: string): Promise<void> =>
    ipcRenderer.invoke('show-info-dialog', message),
  showErrorDialog: (message: string): Promise<void> =>
    ipcRenderer.invoke('show-error-dialog', message),
  showConfirmDialog: (): Promise<boolean | null> =>
    ipcRenderer.invoke('show-confirm-dialog'),
  closeWindow: (): Promise<void> => ipcRenderer.invoke('close-window'),
  flashToMicroPython: (code: string): Promise<void> =>
    ipcRenderer.invoke('flash-to-micro-python', code),
  onBeforeClose: (listener: () => void) => {
    const wrapper = () => {
      listener();
    };
    ipcRenderer.on('before-close', wrapper);
    return () => {
      ipcRenderer.off('before-close', wrapper);
    };
  },
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

export type ElectronAPI = typeof electronAPI;
