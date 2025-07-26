import { resolve } from 'node:path';
import { app, BrowserWindow, ipcMain } from 'electron';
import {
  closeWindow,
  flashToMicroPython,
  openFile,
  saveFile,
  showConfirmDialog,
  showErrorDialog,
  showInfoDialog,
  showOpenDialog,
  showSaveDialog,
} from './handlers.js';
import { startViteServer } from './server.js';
import { fileURLToPath } from 'node:url';

async function createWindow() {
  const mainWindow = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: fileURLToPath(import.meta.resolve('@mpblockly/preload')),
    },
  });

  mainWindow.setMenuBarVisibility(false);

  if (app.isPackaged) {
    mainWindow.loadFile(
      resolve(app.getAppPath(), './renderer/dist/index.html'),
    );
  } else {
    mainWindow.loadURL(await startViteServer());
  }

  mainWindow.on('close', (event) => {
    event.preventDefault();
    mainWindow.webContents.send('before-close');
  });
}

app.whenReady().then(() => {
  ipcMain.handle('open-file', openFile);
  ipcMain.handle('save-file', saveFile);
  ipcMain.handle('show-open-dialog', showOpenDialog);
  ipcMain.handle('show-save-dialog', showSaveDialog);
  ipcMain.handle('show-info-dialog', showInfoDialog);
  ipcMain.handle('show-error-dialog', showErrorDialog);
  ipcMain.handle('show-confirm-dialog', showConfirmDialog);
  ipcMain.handle('close-window', closeWindow);
  ipcMain.handle('flash-to-micro-python', flashToMicroPython);

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
