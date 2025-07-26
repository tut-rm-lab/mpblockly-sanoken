import { useCallback, useEffect, useRef } from 'react';

export interface FileManager<Handle, File> {
  openFile: (handle: Handle) => Promise<File>;
  saveFile: (handle: Handle, data: File) => Promise<void>;
  getData: () => Promise<File>;
  isDirty: (prev: File | null, cur: File) => boolean;
  closeWindow: () => Promise<void>;
  onBeforeClose: (listener: () => void) => () => void;
  showOpenDialog: () => Promise<Handle>;
  showSaveDialog: () => Promise<Handle>;
  showConfirmDialog: () => Promise<boolean>;
}

export function useFileManager<Handle, File>(
  fileManager: FileManager<Handle, File>,
) {
  const prevHandleRef = useRef<Handle>(null);
  const prevFileRef = useRef<File>(null);

  const saveAs = useCallback(async () => {
    const path = await fileManager.showSaveDialog();
    if (path == null) {
      return false;
    }
    const data = await fileManager.getData();
    await fileManager.saveFile(path, data);
    prevHandleRef.current = path;
    prevFileRef.current = data;
    return true;
  }, [fileManager.showSaveDialog, fileManager.saveFile, fileManager.getData]);

  const save = useCallback(async () => {
    if (prevHandleRef.current == null) {
      return saveAs();
    }
    const data = await fileManager.getData();
    await fileManager.saveFile(prevHandleRef.current, data);
    prevFileRef.current = data;
    return true;
  }, [saveAs, fileManager.saveFile, fileManager.getData]);

  const open = useCallback(async () => {
    const data = await fileManager.getData();
    if (fileManager.isDirty(prevFileRef.current, data)) {
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
    prevHandleRef.current = path;
    prevFileRef.current = newData;
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
      if (!fileManager.isDirty(prevFileRef.current, data)) {
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
