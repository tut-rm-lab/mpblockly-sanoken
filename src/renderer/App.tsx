import { Box, Button, Stack, Tab, Tabs, Typography } from '@mui/material';
import type * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';
import { useSetAtom } from 'jotai';
import { useCallback, useMemo, useState } from 'react';
import { blocklyWorkspaceAtom } from './atoms';
import toolbox from './blockly';
import { BlocklyEditor } from './components/BlocklyEditor';
import { useFileManager } from './hooks/useFileManager';
import { useFlash } from './hooks/useFlash';

export function App() {
  const [code, setCode] = useState('');
  const setWorkspace = useSetAtom(blocklyWorkspaceAtom);
  const [tabIndex, setTabIndex] = useState(0);
  const { open, save, saveAs } = useFileManager();
  const { flash, flashing } = useFlash();

  const workspaceRef = useCallback(
    (workspace: Blockly.WorkspaceSvg) => {
      const listener = () => {
        const code = pythonGenerator.workspaceToCode(workspace);
        setCode(code);
      };
      workspace.addChangeListener(listener);
      setWorkspace(workspace);

      return () => {
        workspace.removeChangeListener(listener);
        setWorkspace(undefined);
      };
    },
    [setWorkspace],
  );

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
