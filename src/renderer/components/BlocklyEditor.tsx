import * as Blockly from 'blockly/core';
import { useSetAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { blocklyWorkspaceAtom } from '../atoms/blocklyWorkspace';

interface BlocklyProps {
  options: Blockly.BlocklyOptions;
}

export function BlocklyEditor({ options }: BlocklyProps) {
  const setWorkspace = useSetAtom(blocklyWorkspaceAtom);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const workspace = Blockly.inject(containerRef.current, options);
    setWorkspace(workspace);

    return () => {
      setWorkspace(undefined);
      workspace.dispose();
    };
  }, [options, setWorkspace]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        ref={containerRef}
      />
    </div>
  );
}
