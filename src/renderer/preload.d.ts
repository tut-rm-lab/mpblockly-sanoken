import type { ElectronAPI } from '../types/preload';

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
