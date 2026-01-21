var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
class UIConfig {
  constructor(parseConfig) {
    __publicField(this, "mainConfig");
    this.mainConfig = parseConfig.mainConfig;
  }
}
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
let noteWin;
let isStorage = false;
async function createWindow() {
  const position = await getPosition();
  const size = await initSize();
  const wSize = size ? size[0] : 800;
  const hSize = size ? size[1] : 600;
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "wind.ico"),
    frame: false,
    width: wSize,
    height: hSize,
    resizable: false,
    transparent: true,
    show: false,
    skipTaskbar: true,
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
        storagePosition();
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
  ipcMain.handle("config:get", async (_, path2) => {
    return await readConfig(path2);
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
    win == null ? void 0 : win.show();
  });
}
async function createNoteWindow() {
  noteWin = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "wind.ico"),
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
  noteWin.webContents.on("before-input-event", (event, input) => {
    if (input.control && ["=", "-", "0"].includes(input.key)) {
      event.preventDefault();
    }
  });
  ipcMain.removeHandler("window:close-note-window");
  ipcMain.removeHandler("window:max-note-window");
  ipcMain.removeHandler("window:min-note-window");
  ipcMain.removeHandler("window:restore-note-window");
  ipcMain.handle("window:close-note-window", () => {
    if (!noteWin) return;
    noteWin.close();
    noteWin = null;
  });
  ipcMain.handle("window:max-note-window", () => {
    if (!noteWin) return;
    noteWin.maximize();
  });
  ipcMain.handle("window:min-note-window", () => {
    if (!noteWin) return;
    noteWin.minimize();
  });
  ipcMain.handle("window:restore-note-window", () => {
    if (!noteWin) return;
    noteWin.restore();
  });
  if (VITE_DEV_SERVER_URL) {
    noteWin.loadURL(VITE_DEV_SERVER_URL + "/note");
  } else {
    noteWin.loadFile(path.join(RENDERER_DIST, "note.html"));
  }
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
  }
});
app.whenReady().then(createWindow);
async function storagePosition() {
  const uiConfig = await readConfig("");
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
async function initSize() {
  const config = await readConfig("");
  if (!config) return Promise.resolve(null);
  const timeFontSize = config.mainConfig.time.fontSize;
  const TimeFontNumber = 5;
  const dataFontSize = config.mainConfig.date.fontSize;
  const dataFontNumber = config.mainConfig.date.content.length ? config.mainConfig.date.content.length : 12;
  const spacing = 30;
  const width = Math.max(timeFontSize * TimeFontNumber + spacing, dataFontSize * dataFontNumber + spacing);
  const height = timeFontSize + dataFontSize + spacing * 2;
  return Promise.resolve([width / 2, height]);
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
async function writeConfig(path2, config) {
  try {
    if (path2 === "") path2 = process.env.APP_ROOT + "/config.json";
    await fs.writeFile(path2, JSON.stringify(config, null, 2), "utf-8");
  } catch (error) {
    console.error(error);
  }
}
if (process.platform === "win32") {
  app.commandLine.appendSwitch("high-dpi-support", "true");
  app.commandLine.appendSwitch("force-device-scale-factor", "1");
}
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
