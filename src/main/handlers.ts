import { BrowserWindow, dialog, type IpcMainInvokeEvent } from 'electron';
import { readFile, writeFile } from 'node:fs/promises';
import { resetMicroPython, writeFileToMicroPython } from './microPython.js';

function getWindowFromEvent(event: IpcMainInvokeEvent): BrowserWindow {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (!window) {
    throw new Error('window is null');
  }
  return window;
}

export function openFile(_: IpcMainInvokeEvent, file: string): Promise<string> {
  return readFile(file, { encoding: 'utf8' });
}

export function saveFile(
  _: IpcMainInvokeEvent,
  file: string,
  data: string,
): Promise<void> {
  return writeFile(file, data, { encoding: 'utf8' });
}

export async function showOpenDialog(
  event: IpcMainInvokeEvent,
): Promise<string | null> {
  const { canceled, filePaths } = await dialog.showOpenDialog(
    getWindowFromEvent(event),
    {
      filters: [
        {
          name: 'mpblockly ワークスペース',
          extensions: ['mpblockly'],
        },
      ],
    },
  );
  return canceled ? null : filePaths[0];
}

export async function showSaveDialog(
  event: IpcMainInvokeEvent,
): Promise<string | null> {
  const { canceled, filePath } = await dialog.showSaveDialog(
    getWindowFromEvent(event),
    {
      filters: [
        {
          name: 'mpblockly ワークスペース',
          extensions: ['mpblockly'],
        },
      ],
    },
  );
  return canceled ? null : filePath;
}

export async function showInfoDialog(
  event: IpcMainInvokeEvent,
  message: string,
): Promise<void> {
  await dialog.showMessageBox(getWindowFromEvent(event), {
    type: 'info',
    message,
  });
}

export async function showErrorDialog(
  event: IpcMainInvokeEvent,
  message: string,
): Promise<void> {
  await dialog.showMessageBox(getWindowFromEvent(event), {
    type: 'error',
    message,
  });
}

export async function showConfirmDialog(
  event: IpcMainInvokeEvent,
): Promise<boolean | null> {
  const { response } = await dialog.showMessageBox(getWindowFromEvent(event), {
    type: 'warning',
    message: 'ワークスペースの変更を保存しますか?',
    buttons: ['保存', '保存しない', 'キャンセル'],
    cancelId: 2,
  });
  switch (response) {
    case 0:
      return true;
    case 1:
      return false;
    default:
      return null;
  }
}

export function closeWindow(event: IpcMainInvokeEvent): void {
  getWindowFromEvent(event).destroy();
}

export async function flashToMicroPython(
  _: IpcMainInvokeEvent,
  code: string,
): Promise<void> {
  await writeFileToMicroPython('main.py', code);
  await resetMicroPython();
}
