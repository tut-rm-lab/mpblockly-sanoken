import { useCallback, useState } from 'react';

export function useFlashToMicroPython() {
  const [isFlashing, setIsFlashing] = useState(false);

  const flash = useCallback(async (code: string) => {
    try {
      setIsFlashing(true);
      await window.electronAPI.flashToMicroPython(code);
      await window.electronAPI.showInfoDialog('書き込みに成功しました');
    } catch (error) {
      if (error instanceof Error) {
        await window.electronAPI.showErrorDialog(error.message);
        await window.electronAPI.showErrorDialog('書き込みに失敗しました');
      }
    } finally {
      setIsFlashing(false);
    }
  }, []);

  return { flash, isFlashing };
}
