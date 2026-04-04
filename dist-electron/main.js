var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { app, BrowserWindow, ipcMain, globalShortcut, Tray, Menu, screen, dialog } from "electron";
import { spawn, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
class UIConfig {
  constructor(parseConfig) {
    __publicField(this, "mainConfig");
    this.mainConfig = parseConfig.mainConfig;
  }
}
class SettingConfig {
  constructor(parseConfig) {
    __publicField(this, "setting");
    this.setting = parseConfig.setting;
  }
}
const SWP_NOSIZE = 1;
const SWP_NOMOVE = 2;
const SWP_NOACTIVATE = 16;
const SWP_NOZORDER_BOTTOM = SWP_NOSIZE | SWP_NOMOVE | SWP_NOACTIVATE;
function sendWin32ClockWindowToBack(w) {
  const handleBuf = w.getNativeWindowHandle();
  const hwnd = handleBuf.length >= 8 ? Number(handleBuf.readBigUInt64LE(0)) : handleBuf.readUInt32LE(0);
  const ps = [
    'Add-Type @"',
    "using System;",
    "using System.Runtime.InteropServices;",
    "public class Z {",
    '[DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr h, IntPtr a, int x, int y, int cx, int cy, uint f);',
    "}",
    '"@',
    `[Z]::SetWindowPos([IntPtr]${hwnd}, [IntPtr]1, 0, 0, 0, 0, ${SWP_NOZORDER_BOTTOM})`
  ].join("\r\n");
  const encoded = Buffer.from(ps, "utf16le").toString("base64");
  execFileSync("powershell.exe", ["-NoProfile", "-WindowStyle", "Hidden", "-EncodedCommand", encoded], {
    windowsHide: true,
    timeout: 1e4,
    stdio: "ignore"
  });
}
function showClockWindowBehindOthers() {
  if (!win) return;
  win.showInactive();
  if (process.platform === "win32") {
    setImmediate(() => {
      if (!(win == null ? void 0 : win.isVisible())) return;
      try {
        sendWin32ClockWindowToBack(win);
      } catch (e) {
        console.error("sendWin32ClockWindowToBack:", e);
      }
    });
  }
}
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
const DATADIR = "data";
const TODODIR = "todo";
const TIMETABLE = "timeTable";
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let isDev = process.env.NODE_ENV === "development";
let win;
let noteWin;
let noteWinSavedBounds = null;
let noteWinFillsWorkArea = false;
let isStorage = false;
let tray;
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}
async function createWindow() {
  if (win) return;
  let p = "";
  if (!isDev) p = path.join(getInstallSiblingDir(), "config.json");
  const position = await getPosition();
  const size = await initSize(p);
  const wSize = size ? size[0] : 800;
  const hSize = size ? size[1] : 500;
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "water.ico"),
    frame: false,
    width: wSize,
    height: hSize,
    resizable: false,
    transparent: true,
    show: false,
    skipTaskbar: true,
    focusable: false,
    webPreferences: {
      preload: path.join(MAIN_DIST, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  if (!position || !position[0] || !position[1]) {
    win.center();
  } else {
    win.setPosition(position[0], position[1]);
  }
  ipcMain.handle("window:set-position", (_, x, y) => {
    if (win) win.setPosition(x, y, true);
    if (!isStorage) {
      isStorage = true;
      setTimeout(() => {
        storagePosition(p);
        isStorage = false;
      }, 500);
    }
  });
  ipcMain.handle("window:get-position", () => {
    if (win) {
      return win.getPosition();
    } else {
      return [0, 0];
    }
  });
  ipcMain.handle("window:create-note-window", () => {
    if (noteWin) {
      noteWin.show();
      return;
    }
    createNoteWindow();
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  win.on("ready-to-show", () => {
    showClockWindowBehindOthers();
  });
}
async function createNoteWindow() {
  if (noteWin) {
    noteWin.show();
    return;
  }
  noteWin = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "water.ico"),
    frame: false,
    width: 1400,
    height: 1e3,
    resizable: false,
    show: false,
    webPreferences: {
      preload: path.join(MAIN_DIST, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      spellcheck: false
    }
  });
  if (VITE_DEV_SERVER_URL) {
    noteWin.loadURL(VITE_DEV_SERVER_URL + "/note");
  } else {
    noteWin.loadFile(path.join(RENDERER_DIST, "note.html"));
  }
  const resetNotePageZoom = () => {
    if (noteWin && !noteWin.isDestroyed()) {
      noteWin.webContents.setZoomFactor(1);
    }
  };
  noteWin.webContents.on("did-finish-load", resetNotePageZoom);
  noteWin.webContents.on("zoom-changed", resetNotePageZoom);
  ipcMain.removeHandler("window:close-note-window");
  ipcMain.removeHandler("window:max-note-window");
  ipcMain.removeHandler("window:min-note-window");
  ipcMain.removeHandler("window:restore-note-window");
  ipcMain.removeHandler("file:save");
  ipcMain.removeHandler("file:open");
  ipcMain.removeHandler("file:open-all");
  ipcMain.removeHandler("file:delete");
  ipcMain.removeHandler("file:rename");
  ipcMain.removeHandler("shell:open-terminal-at");
  ipcMain.removeHandler("dialog:open-directory");
  ipcMain.removeHandler("dialog:open-file");
  ipcMain.removeHandler("sticky:get-last-workspace");
  ipcMain.removeHandler("sticky:set-last-workspace");
  ipcMain.removeHandler("setting:get");
  ipcMain.removeHandler("config:get");
  ipcMain.removeHandler("setting:set");
  ipcMain.removeHandler("config:set");
  ipcMain.handle("window:close-note-window", () => {
    if (!noteWin) return;
    noteWin.close();
    noteWin = null;
    noteWinSavedBounds = null;
    noteWinFillsWorkArea = false;
  });
  ipcMain.handle("window:max-note-window", () => {
    if (!noteWin || noteWinFillsWorkArea) return;
    noteWinSavedBounds = noteWin.getBounds();
    const { workArea } = screen.getDisplayMatching(noteWin.getBounds());
    noteWin.setBounds({ ...workArea });
    noteWinFillsWorkArea = true;
  });
  ipcMain.handle("window:min-note-window", () => {
    if (!noteWin) return;
    noteWin.minimize();
  });
  ipcMain.handle("window:restore-note-window", () => {
    if (!noteWin || !noteWinFillsWorkArea) return;
    if (noteWinSavedBounds) {
      noteWin.setBounds(noteWinSavedBounds);
    }
    noteWinSavedBounds = null;
    noteWinFillsWorkArea = false;
  });
  ipcMain.handle("file:save", (_, name, type, content, dir = DATADIR) => {
    return saveFile(name, type, content, dir);
  });
  ipcMain.handle("file:open", async (_, name, dir = DATADIR) => {
    return await getFile(name, dir);
  });
  ipcMain.handle("file:open-all", async (_, dir = DATADIR) => {
    return await getAllFileList(dir);
  });
  ipcMain.handle("file:delete", async (_, name, dir = DATADIR) => {
    return await deleteFile(name, dir);
  });
  ipcMain.handle(
    "file:rename",
    async (_, oldRel, newName, newType, dir = DATADIR) => {
      return await renameWorkspaceFile(dir, oldRel, newName, newType);
    }
  );
  ipcMain.handle("shell:open-terminal-at", async (_, folderPath) => {
    const abs = resolveWorkspaceDir(folderPath);
    if (!await isFolderExist(abs)) return false;
    openTerminalAtFolder(abs);
    return true;
  });
  ipcMain.handle("dialog:open-directory", async (event) => {
    const win2 = BrowserWindow.fromWebContents(event.sender);
    if (!win2) return null;
    const { canceled, filePaths } = await dialog.showOpenDialog(win2, {
      properties: ["openDirectory", "createDirectory"]
    });
    if (canceled || !filePaths[0]) return null;
    return filePaths[0];
  });
  ipcMain.handle("dialog:open-file", async (event) => {
    const win2 = BrowserWindow.fromWebContents(event.sender);
    if (!win2) return null;
    const { canceled, filePaths } = await dialog.showOpenDialog(win2, {
      properties: ["openFile"]
    });
    if (canceled || !filePaths[0]) return null;
    const fullPath = filePaths[0];
    const parsed = path.parse(fullPath);
    const ext = parsed.ext ? parsed.ext.slice(1) : "";
    const type = ext || "txt";
    return {
      fullPath,
      dir: parsed.dir,
      name: parsed.name,
      type
    };
  });
  ipcMain.handle("sticky:get-last-workspace", async () => {
    return await readStickyLastFolder();
  });
  ipcMain.handle("sticky:set-last-workspace", async (_, folder) => {
    await writeStickyLastFolder(folder);
  });
  ipcMain.handle("setting:get", async (_, p) => {
    if (!isDev) p = path.join(getInstallSiblingDir(), "setting.json");
    return await readSetting(p);
  });
  ipcMain.handle("config:get", async (_, p) => {
    if (!isDev) p = path.join(getInstallSiblingDir(), "config.json");
    return await readConfig(p);
  });
  ipcMain.handle("config:set", async (_, p, config) => {
    if (!isDev) p = path.join(getInstallSiblingDir(), "config.json");
    return writeConfig(p, config);
  });
  ipcMain.handle("setting:set", async (_, p, config) => {
    if (!isDev) p = path.join(getInstallSiblingDir(), "setting.json");
    return writeSetting(p, config);
  });
  noteWin.on("ready-to-show", () => {
    noteWin == null ? void 0 : noteWin.show();
  });
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
    noteWin = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
    createNoteWindow();
  }
});
app.commandLine.appendSwitch("no-default-window");
const SCRATCH_HOTKEY = "CommandOrControl+Shift+N";
function createScratchEditorWindow() {
  const scratchWin = new BrowserWindow({
    width: 750,
    height: 800,
    show: false,
    frame: false,
    icon: path.join(process.env.VITE_PUBLIC, "water.ico"),
    webPreferences: {
      preload: path.join(MAIN_DIST, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  if (VITE_DEV_SERVER_URL) {
    scratchWin.loadURL(`${VITE_DEV_SERVER_URL}/scratch.html`);
  } else {
    scratchWin.loadFile(path.join(RENDERER_DIST, "scratch.html"));
  }
  const resetScratchPageZoom = () => {
    if (!scratchWin.isDestroyed()) {
      scratchWin.webContents.setZoomFactor(1);
    }
  };
  scratchWin.webContents.on("did-finish-load", resetScratchPageZoom);
  scratchWin.webContents.on("zoom-changed", resetScratchPageZoom);
  scratchWin.once("ready-to-show", () => {
    scratchWin.show();
  });
}
function registerScratchHotkey() {
  const ok = globalShortcut.register(SCRATCH_HOTKEY, () => {
    createScratchEditorWindow();
  });
  if (!ok) {
    console.error("全局快捷键注册失败:", SCRATCH_HOTKEY);
  }
}
app.whenReady().then(async () => {
  var _a;
  await createAppDataDir();
  await createAppDataDir(TODODIR);
  await createAppDataDir(TIMETABLE);
  await initConfigFile();
  await initSettingFile();
  createTray();
  const p = isDev ? "" : path.join(getInstallSiblingDir(), "setting.json");
  const setting = await readSetting(p);
  if (!isDev) {
    app.setLoginItemSettings({
      openAtLogin: !!(setting == null ? void 0 : setting.setting.autostart),
      openAsHidden: true
    });
  }
  ipcMain.handle("window:close-scratch", (event) => {
    const w = BrowserWindow.fromWebContents(event.sender);
    if (w && !w.isDestroyed()) w.close();
  });
  createNoteWindow();
  registerScratchHotkey();
  if ((_a = setting == null ? void 0 : setting.setting) == null ? void 0 : _a.showClock) {
    createWindow();
    noteWin == null ? void 0 : noteWin.hide();
  }
});
app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
async function storagePosition(path2) {
  const uiConfig = await readConfig(path2);
  if (!uiConfig || !win) return;
  const position = win.getPosition();
  uiConfig.mainConfig.position.x = position[0];
  uiConfig.mainConfig.position.y = position[1];
  await writeConfig("", uiConfig);
}
async function getPosition() {
  const uiConfig = await readConfig("");
  if (!uiConfig || !uiConfig.mainConfig.position) return Promise.resolve(null);
  return Promise.resolve([uiConfig.mainConfig.position.x, uiConfig.mainConfig.position.y]);
}
async function initSize(path2) {
  const config = await readConfig(path2);
  if (!config) return Promise.resolve(null);
  const timeFontSize = config.mainConfig.time.fontSize;
  const TimeFontNumber = 5;
  const dataFontSize = config.mainConfig.date.fontSize;
  const dataFontNumber = config.mainConfig.date.content.length ? config.mainConfig.date.content.length : 12;
  const spacing = 30;
  const width = Math.max(timeFontSize * TimeFontNumber + spacing, dataFontSize * dataFontNumber + spacing);
  const height = timeFontSize + dataFontSize + spacing * 2;
  return Promise.resolve([width + 100, height + 50]);
}
async function readConfig(path2) {
  try {
    if (path2 === "") path2 = process.env.APP_ROOT + "/config.json";
    await fs.access(path2);
    const data = await fs.readFile(path2, "utf-8");
    const parseConfig = JSON.parse(data);
    return new UIConfig(parseConfig);
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function readSetting(path2) {
  try {
    if (path2 === "") path2 = process.env.APP_ROOT + "/setting.json";
    await fs.access(path2);
    const data = await fs.readFile(path2, "utf-8");
    const parseConfig = JSON.parse(data);
    return new SettingConfig(parseConfig);
  } catch (error) {
    console.error(error);
    return null;
  }
}
async function writeConfig(path2, config) {
  try {
    if (path2 === "") path2 = process.env.APP_ROOT + "/config.json";
    const old = await readConfig(path2);
    if (old === null) {
      await fs.writeFile(path2, JSON.stringify(config, null, 2), "utf-8");
    } else {
      const newConfig = deepMerge(old, config);
      await fs.writeFile(path2, JSON.stringify(newConfig, null, 2), "utf-8");
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
async function writeSetting(path2, setting) {
  try {
    if (path2 === "") path2 = process.env.APP_ROOT + "/setting.json";
    await fs.writeFile(path2, JSON.stringify(setting, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
function deepMerge(target, source) {
  const merged = { ...target };
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const targetValue = target[key];
      const sourceValue = source[key];
      if (sourceValue === void 0) continue;
      if (sourceValue !== null && typeof sourceValue === "object" && !Array.isArray(sourceValue) && targetValue !== null && typeof targetValue === "object" && !Array.isArray(targetValue)) {
        merged[key] = deepMerge(targetValue, sourceValue);
      } else {
        merged[key] = sourceValue;
      }
    }
  }
  return merged;
}
function getInstallSiblingDir() {
  try {
    if (isDev) {
      return path.resolve(__dirname$1, "../");
    }
    const exePath = app.getPath("exe");
    const exeDir = path.dirname(exePath);
    return exeDir;
  } catch (error) {
    console.error("解析安装目录失败：", error);
    return app.getPath("documents");
  }
}
async function isFolderExist(path2) {
  try {
    await fs.access(path2, 0);
    const stats = await fs.stat(path2);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}
async function isFileExist(path2) {
  try {
    await fs.access(path2, 0);
    const stats = await fs.stat(path2);
    return stats.isFile();
  } catch (error) {
    return false;
  }
}
async function initConfigFile() {
  if (isDev) return;
  const p = path.join(getInstallSiblingDir(), "config.json");
  if (await isFileExist(p)) return;
  const content = `
{
  "mainConfig": {
    "time": {
      "fontSize": 50,
      "fontColor": "#000000",
      "fontFamily": "Arial"
    },
    "date": {
      "fontSize": 50,
      "fontColor": "#000000",
      "fontFamily": "Arial",
      "content": "Hello"
    },
    "position": {
      "x": 1077,
      "y": 587
    }
  }
}`;
  await fs.writeFile(p, content, "utf-8");
}
async function initSettingFile() {
  if (isDev) return;
  const p = path.join(getInstallSiblingDir(), "setting.json");
  if (await isFileExist(p)) return;
  const content = `
	{
		"setting": {
			"autostart": false,
			"dark": false,
			"showClock": true
		}
	}`;
  await fs.writeFile(p, content, "utf-8");
}
async function createAppDataDir(dir = DATADIR) {
  const appDataDir = path.join(getInstallSiblingDir(), dir);
  const exist = await isFolderExist(appDataDir);
  if (!exist) {
    await fs.mkdir(appDataDir, { recursive: true });
  }
}
function resolveWorkspaceDir(dir) {
  if (!dir) {
    return path.join(getInstallSiblingDir(), DATADIR);
  }
  if (path.isAbsolute(dir)) {
    return dir;
  }
  return path.join(getInstallSiblingDir(), dir);
}
function getStickyWorkspaceJsonPath() {
  return path.join(app.getPath("userData"), "sticky-workspace.json");
}
async function readStickyLastFolder() {
  try {
    const raw = await fs.readFile(getStickyWorkspaceJsonPath(), "utf-8");
    const j = JSON.parse(raw);
    if (typeof j.folder === "string" && j.folder.length > 0) {
      if (await isFolderExist(j.folder)) return j.folder;
    }
    return null;
  } catch {
    return null;
  }
}
async function writeStickyLastFolder(folder) {
  const payload = JSON.stringify({ folder: folder ?? null }, null, 2);
  await fs.writeFile(getStickyWorkspaceJsonPath(), payload, "utf-8");
}
function saveFile(name, type, file, dir = DATADIR) {
  return new Promise(async (resolve, reject) => {
    try {
      const root = resolveWorkspaceDir(dir);
      const base = type ? `${name}.${type}` : name;
      const savePath = path.join(root, base);
      await fs.writeFile(savePath, file, { encoding: "utf8" });
      resolve(true);
    } catch (error) {
      const errMsg = `保存文件失败：${error.message}`;
      reject(new Error(errMsg));
    }
  });
}
function getFile(name, dir = DATADIR) {
  return new Promise(async (resolve, reject) => {
    try {
      const root = resolveWorkspaceDir(dir);
      const filePath = path.join(root, name);
      const data = await fs.readFile(filePath, "utf-8");
      resolve(data);
    } catch (error) {
      reject("");
    }
  });
}
function getAllFileList(dir = DATADIR) {
  return new Promise(async (resolve, reject) => {
    try {
      const filePath = resolveWorkspaceDir(dir);
      const dirents = await fs.readdir(filePath, { withFileTypes: true });
      const fileList = dirents.filter((dirent) => dirent.isFile()).map((dirent) => {
        const parsed = path.parse(dirent.name);
        const ext = parsed.ext ? parsed.ext.slice(1) : "";
        return {
          name: parsed.name,
          type: ext
        };
      });
      resolve(fileList);
    } catch (error) {
      reject([]);
    }
  });
}
function deleteFile(name, dir = DATADIR) {
  return new Promise(async (resolve, reject) => {
    try {
      const root = resolveWorkspaceDir(dir);
      const filePath = path.join(root, name);
      await fs.unlink(filePath);
      resolve(true);
    } catch (error) {
      reject(false);
    }
  });
}
const INVALID_WIN_FILENAME = /[\\/:*?"<>|]/;
async function renameWorkspaceFile(dir, oldRel, newName, newType) {
  try {
    const root = resolveWorkspaceDir(dir);
    const trimmed = newName.trim();
    if (!trimmed || INVALID_WIN_FILENAME.test(trimmed)) return false;
    const ext = newType.trim();
    const newBase = ext ? `${trimmed}.${ext}` : trimmed;
    const oldPath = path.join(root, oldRel);
    const newPath = path.join(root, newBase);
    if (path.normalize(oldPath) === path.normalize(newPath)) return true;
    if (!await isFileExist(oldPath)) return false;
    if (await isFileExist(newPath)) return false;
    await fs.rename(oldPath, newPath);
    return true;
  } catch {
    return false;
  }
}
function openTerminalAtFolder(absDir) {
  if (process.platform === "win32") {
    const dirForCmd = absDir.replace(/"/g, '""');
    const psLiteral = absDir.replace(/'/g, "''");
    const opts = { detached: true, stdio: "ignore", windowsHide: false };
    const startVisibleCmd = () => spawn("cmd.exe", ["/c", "start", "", "cmd", "/k", `cd /d "${dirForCmd}"`], opts).unref();
    const wt = spawn("wt.exe", ["-d", absDir], opts);
    wt.on("error", () => {
      const viaStartPs = spawn(
        "cmd.exe",
        [
          "/c",
          "start",
          "",
          "powershell.exe",
          "-NoExit",
          "-NoProfile",
          "-Command",
          `Set-Location -LiteralPath '${psLiteral}'`
        ],
        opts
      );
      viaStartPs.on("error", () => startVisibleCmd());
      viaStartPs.unref();
    });
    wt.unref();
    return;
  }
  if (process.platform === "darwin") {
    spawn("open", ["-a", "Terminal", absDir], { detached: true, stdio: "ignore" }).unref();
    return;
  }
  const child = spawn("gnome-terminal", ["--working-directory", absDir], {
    detached: true,
    stdio: "ignore"
  });
  child.unref();
}
const createTray = () => {
  if (tray) return;
  const iconPath = path.join(process.env.VITE_PUBLIC, "water.ico");
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "显示/隐藏",
      click: () => {
        if (!win) return;
        if (win.isVisible()) {
          win.hide();
        } else {
          showClockWindowBehindOthers();
        }
      }
    },
    {
      label: "退出",
      click: () => {
        app.quit();
      }
    }
  ]);
  tray.setToolTip("Salvation lies within");
  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    if (!win) return;
    if (win.isVisible()) {
      win.hide();
    } else {
      showClockWindowBehindOthers();
    }
  });
};
if (process.platform === "win32") {
  app.commandLine.appendSwitch("high-dpi-support", "true");
  app.commandLine.appendSwitch("force-device-scale-factor", "1");
}
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
