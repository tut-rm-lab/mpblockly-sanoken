import * as Blockly from 'blockly/core';
import * as Ja from 'blockly/msg/ja';
import { memo, type RefObject, useEffect, useRef } from 'react';

import 'blockly/blocks';

interface BlocklyProps {
  ref: RefObject<Blockly.WorkspaceSvg | null>;
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

    Blockly.setLocale(Ja.default ?? Ja);
    Blockly.dialog.setPrompt((message, _defaultValue, _callback) => {
      window.alert(message);
    });
    const workspace = Blockly.inject(containerRef.current, options);
    ref.current = workspace;

    return () => {
      ref.current = null;
      workspace.dispose();
      Blockly.dialog.setPrompt(undefined);
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
