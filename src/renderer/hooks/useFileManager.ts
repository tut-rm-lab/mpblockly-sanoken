import { useCallback, useEffect, useRef } from 'react';
import { ConfirmResponse } from '../../types/preload';

interface FileManager {
  readFile: (file: string) => Promise<string>;
  writeFile: (file: string, data: string) => Promise<void>;
  exit: () => Promise<void>;
  onExit: (listener: () => void) => () => void;
  showOpenDialog: () => Promise<string | null>;
  showSaveDialog: () => Promise<string | null>;
  showConfirmDialog: () => Promise<ConfirmResponse>;
  getLatestData: () => Promise<string>;
  isDirty: (prev: string | null, cur: string) => boolean;
}

export function useFileManager(fileManager: FileManager) {
  const prevPathRef = useRef<string>(null);
  const prevDataRef = useRef<string>(null);

  const saveAs = useCallback(async () => {
    const path = await fileManager.showSaveDialog();
    if (path == null) {
      return false;
    }
    const data = await fileManager.getLatestData();
    await fileManager.writeFile(path, data);
    prevPathRef.current = path;
    prevDataRef.current = data;
    return true;
  }, [
    fileManager.showSaveDialog,
    fileManager.writeFile,
    fileManager.getLatestData,
  ]);

  const save = useCallback(async () => {
    if (prevPathRef.current == null) {
      return saveAs();
    }
    const data = await fileManager.getLatestData();
    await fileManager.writeFile(prevPathRef.current, data);
    prevDataRef.current = data;
    return true;
  }, [saveAs, fileManager.writeFile, fileManager.getLatestData]);

  const open = useCallback(async () => {
    const data = await fileManager.getLatestData();
    if (await fileManager.isDirty(prevDataRef.current, data)) {
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
    prevPathRef.current = path;
    prevDataRef.current = newData;
    return newData;
  }, [
    save,
    fileManager.readFile,
    fileManager.showConfirmDialog,
    fileManager.showOpenDialog,
    fileManager.getLatestData,
    fileManager.isDirty,
  ]);

  useEffect(() => {
    const unsubscribe = fileManager.onExit(async () => {
      const data = await fileManager.getLatestData();
      if (!(await fileManager.isDirty(prevDataRef.current, data))) {
        await fileManager.exit();
        return;
      }
      const response = await fileManager.showConfirmDialog();
      switch (response) {
        case ConfirmResponse.SAVE:
          if (!(await save())) {
            break;
          }
          await fileManager.exit();
          break;
        case ConfirmResponse.DO_NOT_SAVE:
          await fileManager.exit();
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
    fileManager.exit,
    fileManager.onExit,
    fileManager.showConfirmDialog,
    fileManager.getLatestData,
    fileManager.isDirty,
  ]);

  return { open, save, saveAs };
}
