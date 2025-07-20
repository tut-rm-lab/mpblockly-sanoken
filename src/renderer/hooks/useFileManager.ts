import { useCallback, useEffect, useRef } from 'react';

interface FileManager<T> {
  openFile: (file: string) => Promise<T>;
  saveFile: (file: string, data: T) => Promise<void>;
  getData: () => Promise<T>;
  isDirty: (prev: T | null, cur: T) => boolean;
  closeWindow: () => Promise<void>;
  onBeforeClose: (listener: () => void) => () => void;
  showOpenDialog: () => Promise<string | null>;
  showSaveDialog: () => Promise<string | null>;
  showConfirmDialog: () => Promise<boolean | null>;
}

export function useFileManager<T>(fileManager: FileManager<T>) {
  const prevPathRef = useRef<string>(null);
  const prevDataRef = useRef<T>(null);

  const saveAs = useCallback(async () => {
    const path = await fileManager.showSaveDialog();
    if (path == null) {
      return false;
    }
    const data = await fileManager.getData();
    await fileManager.saveFile(path, data);
    prevPathRef.current = path;
    prevDataRef.current = data;
    return true;
  }, [fileManager.showSaveDialog, fileManager.saveFile, fileManager.getData]);

  const save = useCallback(async () => {
    if (prevPathRef.current == null) {
      return saveAs();
    }
    const data = await fileManager.getData();
    await fileManager.saveFile(prevPathRef.current, data);
    prevDataRef.current = data;
    return true;
  }, [saveAs, fileManager.saveFile, fileManager.getData]);

  const open = useCallback(async () => {
    const data = await fileManager.getData();
    if (fileManager.isDirty(prevDataRef.current, data)) {
      const response = await fileManager.showConfirmDialog();
      if (response == null) {
        return;
      }
      if (response) {
        if (!(await save())) {
          return;
        }
      }
    }
    const path = await fileManager.showOpenDialog();
    if (path == null) {
      return;
    }
    const newData = await fileManager.openFile(path);
    prevPathRef.current = path;
    prevDataRef.current = newData;
    return newData;
  }, [
    save,
    fileManager.openFile,
    fileManager.showConfirmDialog,
    fileManager.showOpenDialog,
    fileManager.getData,
    fileManager.isDirty,
  ]);

  useEffect(() => {
    const unsubscribe = fileManager.onBeforeClose(async () => {
      const data = await fileManager.getData();
      if (!fileManager.isDirty(prevDataRef.current, data)) {
        await fileManager.closeWindow();
        return;
      }
      const response = await fileManager.showConfirmDialog();
      if (response == null) {
        return;
      }
      if (response) {
        if (!(await save())) {
          return;
        }
      }
      await fileManager.closeWindow();
    });

    return () => {
      unsubscribe();
    };
  }, [
    save,
    fileManager.closeWindow,
    fileManager.onBeforeClose,
    fileManager.showConfirmDialog,
    fileManager.getData,
    fileManager.isDirty,
  ]);

  return { open, save, saveAs };
}
