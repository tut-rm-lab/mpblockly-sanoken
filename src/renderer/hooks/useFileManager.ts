import { useCallback, useEffect, useRef } from 'react';
import { ConfirmResponse } from '../../types/preload';

interface FileManager {
  readFile: (file: string) => Promise<string>;
  writeFile: (file: string, data: string) => Promise<void>;
  showOpenDialog: () => Promise<string | null>;
  showSaveDialog: () => Promise<string | null>;
  showConfirmDialog: () => Promise<ConfirmResponse>;
  closeWindow: () => Promise<void>;
  onBeforeClose: (listener: () => void) => () => void;
  getLatestData: () => Promise<string>;
  initialValue: string;
}

export function useFileManager(fileManager: FileManager) {
  const pathRef = useRef<string>(null);
  const dataRef = useRef(fileManager.initialValue);

  const saveAs = useCallback(async () => {
    const path = await fileManager.showSaveDialog();
    if (path == null) {
      return false;
    }
    const data = await fileManager.getLatestData();
    await fileManager.writeFile(path, data);
    pathRef.current = path;
    dataRef.current = data;
    return true;
  }, [
    fileManager.showSaveDialog,
    fileManager.writeFile,
    fileManager.getLatestData,
  ]);

  const save = useCallback(async () => {
    if (pathRef.current == null) {
      return saveAs();
    }
    const data = await fileManager.getLatestData();
    await fileManager.writeFile(pathRef.current, data);
    dataRef.current = data;
    return true;
  }, [saveAs, fileManager.writeFile, fileManager.getLatestData]);

  const open = useCallback(async () => {
    const data = await fileManager.getLatestData();
    if (data !== dataRef.current) {
      const response = await fileManager.showConfirmDialog();
      switch (response) {
        case ConfirmResponse.SAVE:
          if (!(await save())) {
            return;
          }
          break;
        case ConfirmResponse.DO_NOT_SAVE:
          break;
        case ConfirmResponse.CANCEL:
          return;
      }
    }

    const path = await fileManager.showOpenDialog();
    if (path == null) {
      return;
    }
    const newData = await fileManager.readFile(path);
    pathRef.current = path;
    dataRef.current = newData;
    return newData;
  }, [
    save,
    fileManager.readFile,
    fileManager.showConfirmDialog,
    fileManager.showOpenDialog,
    fileManager.getLatestData,
  ]);

  useEffect(() => {
    const unsubscribe = fileManager.onBeforeClose(async () => {
      const data = await fileManager.getLatestData();
      if (data === dataRef.current) {
        await fileManager.closeWindow();
        return;
      }
      const response = await fileManager.showConfirmDialog();
      switch (response) {
        case ConfirmResponse.SAVE:
          if (!(await save())) {
            break;
          }
          await fileManager.closeWindow();
          break;
        case ConfirmResponse.DO_NOT_SAVE:
          await fileManager.closeWindow();
          break;
        case ConfirmResponse.CANCEL:
          break;
      }
    });

    return () => {
      unsubscribe();
    };
  }, [
    save,
    fileManager.closeWindow,
    fileManager.onBeforeClose,
    fileManager.showConfirmDialog,
    fileManager.getLatestData,
  ]);

  return { open, save, saveAs };
}
