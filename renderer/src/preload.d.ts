import type { ElectronAPI } from '../../preload/src/index';

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
