import * as Blockly from 'blockly/core';
import { memo, type RefCallback, useEffect, useRef } from 'react';

interface BlocklyProps {
  ref: RefCallback<Blockly.WorkspaceSvg>;
  options: Blockly.BlocklyOptions;
}

export const BlocklyEditor = memo(function BlocklyEditor({
  ref,
  options,
}: BlocklyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const workspace = Blockly.inject(containerRef.current, options);
    ref(workspace);
    return () => {
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
});
