const { contextBridge, ipcRenderer } = require('electron');

// Exponha funções específicas para o frontend usar
contextBridge.exposeInMainWorld('electronAPI', {
  checkForUpdates: () => ipcRenderer.send('check-for-updates')
});
