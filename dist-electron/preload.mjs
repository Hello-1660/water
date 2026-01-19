"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  // 设置主窗口位置
  setWindowPosition: (x, y) => electron.ipcRenderer.invoke("window:set-position", x, y),
  // 获取主窗口位置
  getWindowPosition: () => electron.ipcRenderer.invoke("window:get-position"),
  // 创建待办事项窗口
  createNoteWindow: () => electron.ipcRenderer.invoke("window:create-note-window"),
  // 读取配置文件
  getConfig: (path) => electron.ipcRenderer.invoke("config:get", path)
});
