import { useCallback, useEffect, useRef } from 'react';
import { ConfirmResponse } from '../../types/preload';

interface FileManager {
  openFile: (file: string) => Promise<string>;
  saveFile: (file: string, data: string) => Promise<void>;
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
  const textRef = useRef(fileManager.initialValue);

  const saveAs = useCallback(async () => {
    const path = await fileManager.showSaveDialog();
    if (path == null) {
      return false;
    }
    const workspaceJson = await fileManager.getLatestData();
    await fileManager.saveFile(path, workspaceJson);
    pathRef.current = path;
    textRef.current = workspaceJson;
    return true;
  }, [
    fileManager.showSaveDialog,
    fileManager.saveFile,
    fileManager.getLatestData,
  ]);

  const save = useCallback(async () => {
    if (pathRef.current == null) {
      return saveAs();
    }
    const workspaceJson = await fileManager.getLatestData();
    await fileManager.saveFile(pathRef.current, workspaceJson);
    textRef.current = workspaceJson;
    return true;
  }, [saveAs, fileManager.saveFile, fileManager.getLatestData]);

  const open = useCallback(async () => {
    const workspaceJson = await fileManager.getLatestData();
    if (workspaceJson !== textRef.current) {
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
    const newWorkspaceJson = await fileManager.openFile(path);
    pathRef.current = path;
    textRef.current = newWorkspaceJson;
    return newWorkspaceJson;
  }, [
    save,
    fileManager.openFile,
    fileManager.showConfirmDialog,
    fileManager.showOpenDialog,
    fileManager.getLatestData,
  ]);

  useEffect(() => {
    const unsubscribe = fileManager.onBeforeClose(async () => {
      const workspaceJson = await fileManager.getLatestData();
      if (workspaceJson === textRef.current) {
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
