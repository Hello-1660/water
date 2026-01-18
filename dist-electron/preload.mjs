"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  // 设置主窗口位置
  setWindowPosition: (x, y) => electron.ipcRenderer.invoke("window:set-position", x, y),
  // 获取主窗口位置
  getWindowPosition: () => electron.ipcRenderer.invoke("window:get-position"),
  // 读取配置文件
  getConfig: (path) => electron.ipcRenderer.invoke("config:get", path)
});
