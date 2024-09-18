const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    },
    icon: path.join(__dirname, 'assets/icons/kanban/kanban_256.png')
  });

  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools();
  mainWindow.maximize();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Handle update check request
ipcMain.on('check-for-updates', () => {
  autoUpdater.checkForUpdates();
});

// Handle update events
autoUpdater.on('update-available', (info) => {
  const userResponse = dialog.showMessageBoxSync(mainWindow, {
    type: 'info',
    buttons: ['Update', 'Later'],
    defaultId: 0,
    title: 'Update Available',
    message: `A new version (${info.version}) is available. Do you want to update now?`
  });

  if (userResponse === 0) {
    autoUpdater.downloadUpdate();
  }
});

autoUpdater.on('update-downloaded', () => {
  const userResponse = dialog.showMessageBoxSync(mainWindow, {
    type: 'info',
    buttons: ['Restart Now', 'Restart Later'],
    defaultId: 0,
    title: 'Update Ready',
    message: 'The update has been downloaded. Restart now to install the update?'
  });

  if (userResponse === 0) {
    autoUpdater.quitAndInstall();
  }
});

autoUpdater.on('update-not-available', () => {
  dialog.showMessageBoxSync(mainWindow, {
    type: 'info',
    title: 'No Update Available',
    message: 'You are already on the latest version.'
  });
});

autoUpdater.on('error', (error) => {
  dialog.showErrorBox('Update Error', error.message);
});
