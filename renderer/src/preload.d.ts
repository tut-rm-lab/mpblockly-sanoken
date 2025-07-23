import type { ElectronAPI } from '../../preload/src/index.cts';

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
