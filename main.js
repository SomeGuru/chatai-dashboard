'use strict';

const { app, BrowserWindow, ipcMain, session, Menu, shell } = require('electron');
const path    = require('path');
const crypto  = require('crypto');
const fs      = require('fs');
const https   = require('https');

const VAULT_FILE        = path.join(app.getPath('userData'), 'vault.enc');
const WINDOW_STATE_FILE = path.join(app.getPath('userData'), 'window-state.json');
const GITHUB_REPO       = 'SomeGuru/chatai-dashboard';
const CHECK_INTERVAL    = 1000 * 60 * 60 * 4; // 4 hours

let mainWindow  = null;
let updateTimer = null;

// ── Window state ──────────────────────────────────────────────────────────────
function loadWindowState() {
  try {
    if (fs.existsSync(WINDOW_STATE_FILE))
      return JSON.parse(fs.readFileSync(WINDOW_STATE_FILE, 'utf8'));
  } catch(e) {}
  return { width:1280, height:820, x:undefined, y:undefined, maximized:false };
}
function saveWindowState(win) {
  try {
    const b = win.getBounds();
    fs.writeFileSync(WINDOW_STATE_FILE,
      JSON.stringify({ ...b, maximized: win.isMaximized() }));
  } catch(e) {}
}

// ── Create window ─────────────────────────────────────────────────────────────
function createWindow() {
  const s = loadWindowState();
  mainWindow = new BrowserWindow({
    width: s.width||1280, height: s.height||820, x: s.x, y: s.y,
    minWidth: 900, minHeight: 600,
    title: 'ChatAI Dashboard',
    backgroundColor: '#0d1117',
    show: false, frame: false, titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false, contextIsolation: true,
      webviewTag: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
  });
  if (s.maximized) mainWindow.maximize();
  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    scheduleUpdateCheck();
  });
  mainWindow.on('resize', () => saveWindowState(mainWindow));
  mainWindow.on('move',   () => saveWindowState(mainWindow));
  mainWindow.on('close',  () => { saveWindowState(mainWindow); clearInterval(updateTimer); });
  Menu.setApplicationMenu(null);
}

app.whenReady().then(() => {
  session.defaultSession.webRequest.onHeadersReceived((details, cb) => {
    cb({ responseHeaders: { ...details.responseHeaders, 'Content-Security-Policy': [''] } });
  });
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on('window-all-closed', () => {
  clearInterval(updateTimer);
  if (process.platform !== 'darwin') app.quit();
});

// ── Window controls ───────────────────────────────────────────────────────────
ipcMain.on('window-minimize', () => mainWindow?.minimize());
ipcMain.on('window-maximize', () => {
  if (mainWindow?.isMaximized()) mainWindow.unmaximize();
  else mainWindow?.maximize();
});
ipcMain.on('window-close',       () => mainWindow?.close());
ipcMain.handle('window-is-maximized', () => mainWindow?.isMaximized() ?? false);

// ── Open external URL (whitelisted to this repo only) ─────────────────────────
ipcMain.on('open-release-page', (_e, url) => {
  if (typeof url === 'string' && url.startsWith('https://github.com/SomeGuru/chatai-dashboard'))
    shell.openExternal(url);
});

// ── Update checker ────────────────────────────────────────────────────────────
function fetchLatestRelease() {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.github.com',
      path: `/repos/${GITHUB_REPO}/releases/latest`,
      method: 'GET',
      headers: {
        'User-Agent': `ChatAI-Dashboard/${app.getVersion()}`,
        'Accept': 'application/vnd.github.v3+json',
      },
      timeout: 10000,
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(new Error('Bad JSON from GitHub')); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timed out')); });
    req.end();
  });
}

function semverGt(a, b) {
  const p = v => v.replace(/^v/,'').split('.').map(Number);
  const [aM,am,ap] = p(a), [bM,bm,bp] = p(b);
  if (aM !== bM) return aM > bM;
  if (am !== bm) return am > bm;
  return ap > bp;
}

async function checkForUpdates(silent = false) {
  try {
    const rel     = await fetchLatestRelease();
    const latest  = rel.tag_name;
    const current = 'v' + app.getVersion();
    const payload = {
      hasUpdate:   semverGt(latest, current),
      current, latest,
      name:        rel.name         || latest,
      body:        rel.body         || 'No release notes.',
      publishedAt: rel.published_at || '',
      htmlUrl:     rel.html_url     || `https://github.com/${GITHUB_REPO}/releases/latest`,
      assets: (rel.assets||[]).map(a => ({
        name: a.name,
        browser_download_url: a.browser_download_url,
        size: a.size,
      })),
    };
    if (payload.hasUpdate || !silent)
      mainWindow?.webContents.send('update-result', payload);
    return payload;
  } catch(err) {
    if (!silent)
      mainWindow?.webContents.send('update-result', {
        hasUpdate: false, error: err.message, current: 'v' + app.getVersion(),
      });
    return null;
  }
}

function scheduleUpdateCheck() {
  setTimeout(() => checkForUpdates(true), 8000);          // silent check 8s after launch
  updateTimer = setInterval(() => checkForUpdates(true), CHECK_INTERVAL);
}

ipcMain.handle('check-for-updates', async () => checkForUpdates(false));
ipcMain.handle('get-app-version',   async () => app.getVersion());

// ── Vault (AES-256-GCM + PBKDF2-SHA256, 210k iterations) ─────────────────────
ipcMain.handle('vault-save', async (_e, { passphrase, data }) => {
  try {
    const salt = crypto.randomBytes(16), iv = crypto.randomBytes(12);
    const key  = crypto.pbkdf2Sync(passphrase, salt, 210000, 32, 'sha256');
    const c    = crypto.createCipheriv('aes-256-gcm', key, iv);
    const enc  = Buffer.concat([c.update(Buffer.from(JSON.stringify(data),'utf8')), c.final()]);
    fs.writeFileSync(VAULT_FILE, Buffer.concat([salt, iv, c.getAuthTag(), enc]));
    return { ok: true };
  } catch(e) { return { ok: false, error: e.message }; }
});

ipcMain.handle('vault-load', async (_e, { passphrase }) => {
  try {
    if (!fs.existsSync(VAULT_FILE)) return { ok: true, data: [] };
    const buf = fs.readFileSync(VAULT_FILE);
    const key = crypto.pbkdf2Sync(passphrase, buf.slice(0,16), 210000, 32, 'sha256');
    const d   = crypto.createDecipheriv('aes-256-gcm', key, buf.slice(16,28));
    d.setAuthTag(buf.slice(28,44));
    const plain = Buffer.concat([d.update(buf.slice(44)), d.final()]);
    return { ok: true, data: JSON.parse(plain.toString('utf8')) };
  } catch(e) { return { ok: false, error: 'Invalid passphrase or corrupted vault.' }; }
});

ipcMain.handle('vault-exists', async () => fs.existsSync(VAULT_FILE));
