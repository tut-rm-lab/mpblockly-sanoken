import * as Blockly from 'blockly/core';
import * as Ja from 'blockly/msg/ja';
import {
  memo,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { PromptDialog } from './PromptDialog';

import 'blockly/blocks';
import { callOnWorkspaceInit } from '../blockly/utils';

interface BlocklyProps {
  ref: RefObject<Blockly.WorkspaceSvg | null>;
  options: Blockly.BlocklyOptions;
}

export const BlocklyEditor = memo(function BlocklyEditor({
  ref,
  options,
}: BlocklyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [promptOpen, setPromptOpen] = useState(false);
  const [promptData, setPromptData] = useState({
    message: '',
    defaultValue: '',
  });
  const promptCallbackRef = useRef<(result: string | null) => void>(() => {});

  const submitPrompt = useCallback((result: string) => {
    promptCallbackRef.current(result);
    setPromptOpen(false);
  }, []);

  const cancelPrompt = useCallback(() => {
    promptCallbackRef.current(null);
    setPromptOpen(false);
  }, []);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    Blockly.setLocale(Ja.default ?? Ja);
    Blockly.dialog.setPrompt((message, defaultValue, callback) => {
      promptCallbackRef.current = callback;
      setPromptData({ message, defaultValue });
      setPromptOpen(true);
    });
    const workspace = Blockly.inject(containerRef.current, options);
    for (const callback of callOnWorkspaceInit) {
      callback(workspace);
    }
    ref.current = workspace;

    return () => {
      ref.current = null;
      workspace.dispose();
      Blockly.dialog.setPrompt(undefined);
    };
  }, [ref, options]);

  return (
    <>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div
          style={{ position: 'absolute', width: '100%', height: '100%' }}
          ref={containerRef}
        />
      </div>
      <PromptDialog
        open={promptOpen}
        message={promptData.message}
        defaultValue={promptData.defaultValue}
        onSubmit={submitPrompt}
        onCancel={cancelPrompt}
      />
    </>
  );
});
