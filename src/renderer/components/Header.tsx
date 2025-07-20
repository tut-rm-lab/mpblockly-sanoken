import {
  Button,
  Paper,
  ScopedCssBaseline,
  Stack,
  Tab,
  Tabs,
} from '@mui/material';
import * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';
import { useAtom, useAtomValue } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ConfirmResponse } from '../../types/preload';
import { blocklyWorkspaceAtom, tabIndexAtom } from '../atoms';

const BLANK_WORKSPACE_JSON = JSON.stringify(
  Blockly.serialization.workspaces.save(new Blockly.Workspace()),
);

export function Header() {
  const [tabIndex, setTabIndex] = useAtom(tabIndexAtom);
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
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'grey.500',
        }}
      >
        <Stack direction="row" spacing={1} sx={{ marginX: 1 }}>
          <Button variant="contained" onClick={open}>
            開く
          </Button>
          <Button variant="contained" color="secondary" onClick={save}>
            上書き保存
          </Button>
          <Button variant="contained" color="secondary" onClick={saveAs}>
            別名保存
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={flash}
            disabled={flashing}
          >
            基板に書き込む
          </Button>
        </Stack>
        <Tabs
          value={tabIndex}
          onChange={(_, index) => {
            setTabIndex(index);
          }}
        >
          <Tab label="ブロック" />
          <Tab label="コード" />
        </Tabs>
      </Stack>
    </ScopedCssBaseline>
  );
}
