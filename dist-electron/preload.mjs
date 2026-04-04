"use strict";
const electron = require("electron");
const DATADIR = "data";
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
  // 关闭快捷键弹出的草稿编辑窗
  closeScratchWindow: () => electron.ipcRenderer.invoke("window:close-scratch"),
  // 读取配置文件
  getConfig: (path) => electron.ipcRenderer.invoke("config:get", path),
  // 修改配置文件
  setConfig: (path, config) => electron.ipcRenderer.invoke("config:set", path, config),
  // 读取通用配置文件
  getSetting: (path) => electron.ipcRenderer.invoke("setting:get", path),
  // 修改通用配置文件
  setSetting: (path, config) => electron.ipcRenderer.invoke("setting:set", path, config),
  // 保存文件
  saveFile: (name, type, content, dir = DATADIR) => electron.ipcRenderer.invoke("file:save", name, type, content, dir),
  // 获取单个文件
  openFile: (name, dir = DATADIR) => electron.ipcRenderer.invoke("file:open", name, dir),
  // 获取所有文件信息
  openAllFiles: (dir = DATADIR) => electron.ipcRenderer.invoke("file:open-all", dir),
  openWorkspaceTree: (dir = DATADIR) => electron.ipcRenderer.invoke("file:open-workspace-tree", dir),
  // 删除文件
  deleteFile: (name, dir = DATADIR) => electron.ipcRenderer.invoke("file:delete", name, dir),
  // 工作区内重命名文件（oldRel 为磁盘相对名，如 note.html）
  renameWorkspaceFile: (oldRel, newName, newType, dir = DATADIR) => electron.ipcRenderer.invoke("file:rename", oldRel, newName, newType, dir),
  // 在系统终端中打开指定文件夹
  openTerminalAt: (folderPath) => electron.ipcRenderer.invoke("shell:open-terminal-at", folderPath),
  /** 在系统文件管理器中打开工作区内子文件夹 */
  openFolderInOS: (workspaceRoot, relFolderPath) => electron.ipcRenderer.invoke("shell:open-folder-location", workspaceRoot, relFolderPath),
  // 便签：选择文件夹
  pickWorkspaceFolder: () => electron.ipcRenderer.invoke("dialog:open-directory"),
  // 便签：选择单个文件（返回目录用于作为工作区）
  pickFileToOpen: () => electron.ipcRenderer.invoke("dialog:open-file"),
  stickyGetLastWorkspace: () => electron.ipcRenderer.invoke("sticky:get-last-workspace"),
  stickySetLastWorkspace: (folder) => electron.ipcRenderer.invoke("sticky:set-last-workspace", folder),
  getPackagedInfo: () => electron.ipcRenderer.invoke("app:get-packaged-info"),
  updaterDownload: () => electron.ipcRenderer.invoke("updater:download"),
  updaterQuitAndInstall: () => electron.ipcRenderer.invoke("updater:quit-and-install"),
  updaterCheckNow: () => electron.ipcRenderer.invoke("updater:check-now"),
  updaterOnUpdateAvailable: (cb) => {
    const ch = "updater:update-available";
    const fn = (_e, p) => cb(p);
    electron.ipcRenderer.on(ch, fn);
    return () => electron.ipcRenderer.removeListener(ch, fn);
  },
  updaterOnDownloadProgress: (cb) => {
    const ch = "updater:download-progress";
    const fn = (_e, p) => cb(p);
    electron.ipcRenderer.on(ch, fn);
    return () => electron.ipcRenderer.removeListener(ch, fn);
  },
  updaterOnUpdateDownloaded: (cb) => {
    const ch = "updater:update-downloaded";
    const fn = (_e, p) => cb(p);
    electron.ipcRenderer.on(ch, fn);
    return () => electron.ipcRenderer.removeListener(ch, fn);
  },
  updaterOnError: (cb) => {
    const ch = "updater:error";
    const fn = (_e, p) => cb(p);
    electron.ipcRenderer.on(ch, fn);
    return () => electron.ipcRenderer.removeListener(ch, fn);
  },
  updaterOnUpdateNotAvailable: (cb) => {
    const ch = "updater:update-not-available";
    const fn = () => cb();
    electron.ipcRenderer.on(ch, fn);
    return () => electron.ipcRenderer.removeListener(ch, fn);
  }
});
