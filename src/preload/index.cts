import { contextBridge, ipcRenderer } from 'electron';
import type { ElectronAPI } from '../types/preload';

contextBridge.exposeInMainWorld('electronAPI', {
  readFile: (file) => ipcRenderer.invoke('open-file', file),
  writeFile: (file, data) => ipcRenderer.invoke('save-file', file, data),
  showOpenDialog: () => ipcRenderer.invoke('show-open-dialog'),
  showSaveDialog: () => ipcRenderer.invoke('show-save-dialog'),
  showInfoDialog: (message) => ipcRenderer.invoke('show-info-dialog', message),
  showErrorDialog: (message) =>
    ipcRenderer.invoke('show-error-dialog', message),
  showConfirmDialog: () => ipcRenderer.invoke('show-confirm-dialog'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  flashToMicroPython: (code) => ipcRenderer.invoke('flash-to-pico', code),
  onBeforeClose: (listener) => {
    const wrapper = () => {
      listener();
    };
    ipcRenderer.on('before-close', wrapper);
    return () => {
      ipcRenderer.off('before-close', wrapper);
    };
  },
} satisfies ElectronAPI);
