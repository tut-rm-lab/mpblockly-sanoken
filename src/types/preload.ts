export interface ElectronAPI {
  openFile: (file: string) => Promise<string>;
  saveFile: (file: string, data: string) => Promise<void>;
  showOpenDialog: () => Promise<string | null>;
  showSaveDialog: () => Promise<string | null>;
  showInfoDialog: (message: string) => Promise<void>;
  showErrorDialog: (message: string) => Promise<void>;
  showConfirmDialog: () => Promise<boolean | null>;
  closeWindow: () => Promise<void>;
  flashToMicroPython: (code: string) => Promise<void>;
  onBeforeClose: (listener: () => void) => () => void;
}
