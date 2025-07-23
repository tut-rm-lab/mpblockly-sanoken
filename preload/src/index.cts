import { contextBridge, ipcRenderer } from 'electron';

const electronAPI = {
  openFile: (file: string) => ipcRenderer.invoke('open-file', file),
  saveFile: (file: string, data: string) =>
    ipcRenderer.invoke('save-file', file, data),
  showOpenDialog: () => ipcRenderer.invoke('show-open-dialog'),
  showSaveDialog: () => ipcRenderer.invoke('show-save-dialog'),
  showInfoDialog: (message: string) =>
    ipcRenderer.invoke('show-info-dialog', message),
  showErrorDialog: (message: string) =>
    ipcRenderer.invoke('show-error-dialog', message),
  showConfirmDialog: () => ipcRenderer.invoke('show-confirm-dialog'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  flashToMicroPython: (code: string) =>
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
