import { Button, ButtonGroup, ScopedCssBaseline } from '@mui/material';
import * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ConfirmResponse } from '../../types/preload';
import { blocklyWorkspaceAtom } from '../atoms/blocklyWorkspace';

const BLANK_WORKSPACE_JSON = JSON.stringify(
  Blockly.serialization.workspaces.save(new Blockly.Workspace()),
);

export function Header() {
  const workspace = useAtomValue(blocklyWorkspaceAtom);
  const pathRef = useRef<string>(null);
  const workspaceJsonRef = useRef(BLANK_WORKSPACE_JSON);
  const [flashing, setFlashing] = useState(false);

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

  const flash = useCallback(async () => {
    if (!workspace) {
      return;
    }
    const code = pythonGenerator.workspaceToCode(workspace);
    console.log(code);
    try {
      setFlashing(true);
      await window.electronAPI.flashToPico(code);
      await window.electronAPI.showInfoDialog('書き込みに成功しました');
    } catch (error) {
      if (error instanceof Error) {
        await window.electronAPI.showErrorDialog(error.message);
        await window.electronAPI.showErrorDialog('書き込みに失敗しました');
      }
    } finally {
      setFlashing(false);
    }
  }, [workspace]);

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

  return (
    <ScopedCssBaseline>
      <ButtonGroup sx={{ margin: 1 }} variant="contained">
        <Button onClick={open}>開く</Button>
        <Button onClick={save}>上書き保存</Button>
        <Button onClick={saveAs}>別名保存</Button>
        <Button
          sx={{ textTransform: 'none' }}
          onClick={flash}
          disabled={flashing}
        >
          Pico に書き込み
        </Button>
      </ButtonGroup>
    </ScopedCssBaseline>
  );
}
