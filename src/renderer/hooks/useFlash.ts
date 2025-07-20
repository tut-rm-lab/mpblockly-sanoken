import { useCallback, useState } from 'react';

export function useFlash() {
  const [flashing, setFlashing] = useState(false);

  const flash = useCallback(async (code: string) => {
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
  }, []);

  return { flash, flashing };
}
