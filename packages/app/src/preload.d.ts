import type { ElectronAPI } from '@mpblockly/preload';

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
