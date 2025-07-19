export const ConfirmResponse = {
  SAVE: 0,
  DO_NOT_SAVE: 1,
  CANCEL: 2,
} as const;

export type ConfirmResponse =
  (typeof ConfirmResponse)[keyof typeof ConfirmResponse];

export interface ElectronAPI {
  openFile: (file: string) => Promise<string>;
  saveFile: (file: string, data: string) => Promise<void>;
  showOpenDialog: () => Promise<string | null>;
  showSaveDialog: () => Promise<string | null>;
  showInfoDialog: (message: string) => Promise<void>;
  showErrorDialog: (message: string) => Promise<void>;
  showConfirmDialog: () => Promise<ConfirmResponse>;
  closeWindow: () => Promise<void>;
  flashToPico: (code: string) => Promise<void>;
  onBeforeClose: (listener: () => void) => () => void;
}
