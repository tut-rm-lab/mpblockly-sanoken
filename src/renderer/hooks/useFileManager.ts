import * as Blockly from 'blockly/core';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import { ConfirmResponse } from '../../types/preload';
import { blocklyWorkspaceAtom } from '../atoms';

const BLANK_WORKSPACE_JSON = JSON.stringify(
  Blockly.serialization.workspaces.save(new Blockly.Workspace()),
);

export function useFileManager() {
  const workspace = useAtomValue(blocklyWorkspaceAtom);
  const pathRef = useRef<string>(null);
  const workspaceJsonRef = useRef(BLANK_WORKSPACE_JSON);

  const saveAs = useCallback(async () => {
    if (!workspace) {
      return false;
    }
    const path = await window.electronAPI.showSaveDialog();
    if (path == null) {
      return false;
    }
    const workspaceJson = JSON.stringify(
      Blockly.serialization.workspaces.save(workspace),
    );
    await window.electronAPI.saveFile(path, workspaceJson);
    pathRef.current = path;
    workspaceJsonRef.current = workspaceJson;
    return true;
  }, [workspace]);

  const save = useCallback(async () => {
    if (!workspace) {
      return false;
    }
    if (pathRef.current == null) {
      return saveAs();
    }
    const workspaceJson = JSON.stringify(
      Blockly.serialization.workspaces.save(workspace),
    );
    await window.electronAPI.saveFile(pathRef.current, workspaceJson);
    workspaceJsonRef.current = workspaceJson;
    return true;
  }, [workspace, saveAs]);

  const open = useCallback(async () => {
    if (!workspace) {
      return;
    }

    const workspaceJson = JSON.stringify(
      Blockly.serialization.workspaces.save(workspace),
    );
    if (workspaceJson !== workspaceJsonRef.current) {
      const response = await window.electronAPI.showConfirmDialog();
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

    const path = await window.electronAPI.showOpenDialog();
    if (path == null) {
      return;
    }
    const newWorkspaceJson = await window.electronAPI.openFile(path);
    Blockly.serialization.workspaces.load(
      JSON.parse(newWorkspaceJson),
      workspace,
    );
    pathRef.current = path;
    workspaceJsonRef.current = newWorkspaceJson;
  }, [workspace, save]);

  useEffect(() => {
    const unsubscribe = window.electronAPI.onBeforeClose(async () => {
      if (!workspace) {
        await window.electronAPI.closeWindow();
        return;
      }
      const workspaceJson = JSON.stringify(
        Blockly.serialization.workspaces.save(workspace),
      );
      if (workspaceJson === workspaceJsonRef.current) {
        await window.electronAPI.closeWindow();
        return;
      }
      const response = await window.electronAPI.showConfirmDialog();
      switch (response) {
        case ConfirmResponse.SAVE:
          if (!(await save())) {
            break;
          }
          await window.electronAPI.closeWindow();
          break;
        case ConfirmResponse.DO_NOT_SAVE:
          await window.electronAPI.closeWindow();
          break;
        case ConfirmResponse.CANCEL:
          break;
      }
    });

    return () => {
      unsubscribe();
    };
  }, [workspace, save]);

  return { open, save, saveAs };
}
