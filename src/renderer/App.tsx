import type * as Blockly from 'blockly/core';
import { useRef } from 'react';
import toolbox from './blockly';
import { ReactBlockly } from './components/ReactBlockly';
import { Toolbar } from './components/Toolbar';

export function App() {
  const workspaceRef = useRef<Blockly.Workspace>(null);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100dvw',
        height: '100dvh',
        overflow: 'hidden',
      }}
    >
      <Toolbar workspaceRef={workspaceRef} />
      <div style={{ flex: 1 }}>
        <ReactBlockly ref={workspaceRef} options={{ toolbox }} />
      </div>
    </div>
  );
}
