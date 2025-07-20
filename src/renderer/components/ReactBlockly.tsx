import * as Blockly from 'blockly/core';
import { type RefObject, useEffect, useRef } from 'react';

interface BlocklyProps {
  ref: RefObject<Blockly.Workspace | null>;
  options: Blockly.BlocklyOptions;
}

export function ReactBlockly({ ref, options }: BlocklyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const workspace = Blockly.inject(containerRef.current, options);
    ref.current = workspace;

    return () => {
      ref.current = null;
      workspace.dispose();
    };
  }, [ref, options]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        ref={containerRef}
      />
    </div>
  );
}
