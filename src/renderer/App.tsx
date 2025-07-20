import { useAtomValue, useSetAtom } from 'jotai';
import { blocklyCodeAtom, blocklyWorkspaceAtom, tabIndexAtom } from './atoms';
import { Box, ScopedCssBaseline, Stack, Typography } from '@mui/material';
import { useCallback, useMemo, type PropsWithChildren } from 'react';
import { Header } from './components/Header';
import { BlocklyEditor } from './components/BlocklyEditor';
import * as Blockly from 'blockly/core';
import { pythonGenerator } from 'blockly/python';
import toolbox from './blockly';

export function App() {
  const tabIndex = useAtomValue(tabIndexAtom);
  const code = useAtomValue(blocklyCodeAtom);

  const setWorkspace = useSetAtom(blocklyWorkspaceAtom);
  const setCode = useSetAtom(blocklyCodeAtom);

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
    [setWorkspace, setCode],
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
      <Header />
      <Box sx={{ flex: 1, position: 'relative' }}>
        <Box sx={{ position: 'absolute', width: '100%', height: '100%' }}>
          <BlocklyEditor ref={workspaceRef} options={options} />
        </Box>
        <Box
          sx={{
            display: tabIndex === 1 ? 'block' : 'none',
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 100001,
          }}
        >
          <ScopedCssBaseline
            sx={{
              width: '100%',
              height: '100%',
              overflow: 'auto',
              padding: 2,
              bgcolor: 'background.paper',
            }}
          >
            <Typography component="pre">
              <code>{code}</code>
            </Typography>
          </ScopedCssBaseline>
        </Box>
      </Box>
    </Stack>
  );
}
