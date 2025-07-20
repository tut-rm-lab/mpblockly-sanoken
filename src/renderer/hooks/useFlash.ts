import { pythonGenerator } from 'blockly/python';
import { useAtomValue } from 'jotai';
import { useCallback, useState } from 'react';
import { blocklyWorkspaceAtom } from '../atoms';

export function useFlash() {
  const workspace = useAtomValue(blocklyWorkspaceAtom);
  const [flashing, setFlashing] = useState(false);

  const flash = useCallback(async () => {
    if (!workspace) {
      return;
    }
    const code = pythonGenerator.workspaceToCode(workspace);
    console.log(code);
    try {
      setFlashing(true);
      await window.electronAPI.flashToPico(code);
      await window.electronAPI.showInfoDialog('書き込みに成功しました');
    } catch (error) {
      if (error instanceof Error) {
        await window.electronAPI.showErrorDialog(error.message);
        await window.electronAPI.showErrorDialog('書き込みに失敗しました');
      }
    } finally {
      setFlashing(false);
    }
  }, [workspace]);

  return { flash, flashing };
}
