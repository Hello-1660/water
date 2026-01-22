"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  // 设置主窗口位置
  setWindowPosition: (x, y) => electron.ipcRenderer.invoke("window:set-position", x, y),
  // 获取主窗口位置
  getWindowPosition: () => electron.ipcRenderer.invoke("window:get-position"),
  // 创建待办事项窗口
  createNoteWindow: () => electron.ipcRenderer.invoke("window:create-note-window"),
  // 关闭待办事项窗口
  closeNoteWindow: () => electron.ipcRenderer.invoke("window:close-note-window"),
  // 最大化待办事项窗口
  maxNoteWindow: () => electron.ipcRenderer.invoke("window:max-note-window"),
  // 最小化待办事项窗口
  minNoteWindow: () => electron.ipcRenderer.invoke("window:min-note-window"),
  // 恢复待办事项窗口
  restoreNoteWindow: () => electron.ipcRenderer.invoke("window:restore-note-window"),
  // 读取配置文件
  getConfig: (path) => electron.ipcRenderer.invoke("config:get", path),
  // 保存文件
  saveFile: (name, content) => electron.ipcRenderer.invoke("file:save", name, content),
  // 获取单个文件
  getFile: (name) => electron.ipcRenderer.invoke("file:get", name),
  // 获取所有文件信息
  getFiles: () => electron.ipcRenderer.invoke("file:get-files"),
  // 删除文件
  deleteFile: (name) => electron.ipcRenderer.invoke("file:delete", name)
});
