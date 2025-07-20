import { Box, Stack } from '@mui/material';
import type * as Blockly from 'blockly/core';
import { useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { blocklyWorkspaceAtom } from './atoms/blocklyWorkspace';
import toolbox from './blockly';
import { BlocklyEditor } from './components/BlocklyEditor';
import { Header } from './components/Header';

export function App() {
  const setWorkspace = useSetAtom(blocklyWorkspaceAtom);

  const workspaceRef = useCallback(
    (workspace: Blockly.Workspace) => {
      setWorkspace(workspace);
      return () => {
        setWorkspace(undefined);
      };
    },
    [setWorkspace],
  );

  return (
    <Stack
      sx={{
        width: '100dvw',
        height: '100dvh',
        overflow: 'hidden',
      }}
    >
      <Header />
      <Box sx={{ flex: 1 }}>
        <BlocklyEditor ref={workspaceRef} options={{ toolbox }} />
      </Box>
    </Stack>
  );
}
