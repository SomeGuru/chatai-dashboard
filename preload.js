'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Window
  minimize:    ()    => ipcRenderer.send('window-minimize'),
  maximize:    ()    => ipcRenderer.send('window-maximize'),
  close:       ()    => ipcRenderer.send('window-close'),
  isMaximized: ()    => ipcRenderer.invoke('window-is-maximized'),

  // Vault
  vaultSave:   (a)   => ipcRenderer.invoke('vault-save', a),
  vaultLoad:   (a)   => ipcRenderer.invoke('vault-load', a),
  vaultExists: ()    => ipcRenderer.invoke('vault-exists'),

  // Updates
  checkForUpdates: ()    => ipcRenderer.invoke('check-for-updates'),
  getAppVersion:   ()    => ipcRenderer.invoke('get-app-version'),
  openReleasePage: (url) => ipcRenderer.send('open-release-page', url),
  onUpdateResult:  (cb)  => ipcRenderer.on('update-result', (_e, data) => cb(data)),
});
