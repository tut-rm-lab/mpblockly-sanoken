import { Box, Button, Stack, Tab, Tabs, Typography } from '@mui/material';
import * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';
import { useEffect, useMemo, useRef, useState } from 'react';
import toolbox from './blockly';
import { BlocklyEditor } from './components/BlocklyEditor';
import { useFileManager } from './hooks/useFileManager';
import { useFlash } from './hooks/useFlash';

export function App() {
  const workspaceRef = useRef<Blockly.WorkspaceSvg>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [code, setCode] = useState('');
  const { open, save, saveAs } = useFileManager({
    readFile: window.electronAPI.readFile,
    writeFile: window.electronAPI.writeFile,
    showOpenDialog: window.electronAPI.showOpenDialog,
    showSaveDialog: window.electronAPI.showSaveDialog,
    showConfirmDialog: window.electronAPI.showConfirmDialog,
    closeWindow: window.electronAPI.closeWindow,
    onBeforeClose: window.electronAPI.onBeforeClose,
    getLatestData: async () => {
      if (!workspaceRef.current) {
        throw new Error('workspace is null');
      }
      return JSON.stringify(
        Blockly.serialization.workspaces.save(workspaceRef.current),
      );
    },
    initialValue: JSON.stringify(
      Blockly.serialization.workspaces.save(new Blockly.Workspace()),
    ),
  });
  const { flash, flashing } = useFlash();

  useEffect(() => {
    const workspace = workspaceRef.current;
    if (!workspace) {
      return;
    }
    const listener = () => {
      const code = pythonGenerator.workspaceToCode(workspace);
      setCode(code);
    };
    workspace.addChangeListener(listener);

    return () => {
      workspace.removeChangeListener(listener);
    };
  }, []);

  const options = useMemo(() => ({ toolbox }), []);

  return (
    <Stack
      sx={{
        width: '100dvw',
        height: '100dvh',
        overflow: 'hidden',
      }}
    >
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
          <Button
            variant="contained"
            onClick={async () => {
              if (!workspaceRef.current) {
                throw new Error('workspace is null');
              }
              const data = await open();
              if (data) {
                Blockly.serialization.workspaces.load(
                  JSON.parse(data),
                  workspaceRef.current,
                );
              }
            }}
          >
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
            onClick={async () => {
              await flash(code);
            }}
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
      <Box
        sx={{
          display: tabIndex === 0 ? 'block' : 'none',
          flex: 1,
        }}
      >
        <BlocklyEditor ref={workspaceRef} options={options} />
      </Box>
      {tabIndex === 1 && (
        <Box
          sx={{
            flex: 1,
            padding: 2,
            overflow: 'auto',
          }}
        >
          <Typography component="pre">
            <code>{code}</code>
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
