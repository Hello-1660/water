import { ipcRenderer, contextBridge } from 'electron'
import { UIConfig, SettingConfig } from '../src/config/Config'

const DATADIR = 'data'


contextBridge.exposeInMainWorld('electronAPI', {
	// 设置主窗口位置
	setWindowPosition: (x: number, y: number): Promise<void> => ipcRenderer.invoke('window:set-position', x, y),
	// 获取主窗口位置
	getWindowPosition: (): Promise<[x: number, y: number]> => ipcRenderer.invoke('window:get-position'),
	// 创建待办事项窗口
	createNoteWindow: (): Promise<void> => ipcRenderer.invoke('window:create-note-window'),
	// 关闭待办事项窗口
	closeNoteWindow: (): Promise<void> => ipcRenderer.invoke('window:close-note-window'),
	// 最大化待办事项窗口
	maxNoteWindow: (): Promise<void> => ipcRenderer.invoke('window:max-note-window'),
	// 最小化待办事项窗口
	minNoteWindow: (): Promise<void> => ipcRenderer.invoke('window:min-note-window'),
	// 恢复待办事项窗口
	restoreNoteWindow: (): Promise<void> => ipcRenderer.invoke('window:restore-note-window'),
	// 关闭快捷键弹出的草稿编辑窗
	closeScratchWindow: (): Promise<void> => ipcRenderer.invoke('window:close-scratch'),
	// 读取配置文件
	getConfig: (path: string): Promise<UIConfig> => ipcRenderer.invoke('config:get', path),
	// 修改配置文件
	setConfig: (path: string, config: any): Promise<boolean> => ipcRenderer.invoke('config:set', path, config),
	// 读取通用配置文件
	getSetting: (path: string): Promise<SettingConfig> => ipcRenderer.invoke('setting:get', path),
	// 修改通用配置文件
	setSetting: (path: string, config: SettingConfig): Promise<boolean> => ipcRenderer.invoke('setting:set', path, config),
	// 保存文件
	saveFile: (name: string, type: string , content: string, dir: string = DATADIR): Promise<boolean> => ipcRenderer.invoke('file:save', name, type, content, dir),
	// 获取单个文件
	openFile: (name: string, dir: string = DATADIR): Promise<string> => ipcRenderer.invoke('file:open', name, dir),
	// 获取所有文件信息
	openAllFiles: (dir: String = DATADIR): Promise<{name: string, type: string}[]> => ipcRenderer.invoke('file:open-all', dir),
	// 删除文件
	deleteFile: (name: string, dir: string = DATADIR): Promise<boolean> => ipcRenderer.invoke('file:delete', name, dir),
	// 工作区内重命名文件（oldRel 为磁盘相对名，如 note.html）
	renameWorkspaceFile: (
		oldRel: string,
		newName: string,
		newType: string,
		dir: string = DATADIR
	): Promise<boolean> => ipcRenderer.invoke('file:rename', oldRel, newName, newType, dir),
	// 在系统终端中打开指定文件夹
	openTerminalAt: (folderPath: string): Promise<boolean> =>
		ipcRenderer.invoke('shell:open-terminal-at', folderPath),
	// 便签：选择文件夹
	pickWorkspaceFolder: (): Promise<string | null> => ipcRenderer.invoke('dialog:open-directory'),
	// 便签：选择单个文件（返回目录用于作为工作区）
	pickFileToOpen: (): Promise<{
		fullPath: string
		dir: string
		name: string
		type: string
	} | null> => ipcRenderer.invoke('dialog:open-file'),
	stickyGetLastWorkspace: (): Promise<string | null> => ipcRenderer.invoke('sticky:get-last-workspace'),
	stickySetLastWorkspace: (folder: string | null): Promise<void> =>
		ipcRenderer.invoke('sticky:set-last-workspace', folder),

	getPackagedInfo: (): Promise<{ isPackaged: boolean; version: string }> =>
		ipcRenderer.invoke('app:get-packaged-info'),
	updaterDownload: (): Promise<boolean> => ipcRenderer.invoke('updater:download'),
	updaterQuitAndInstall: (): Promise<void> => ipcRenderer.invoke('updater:quit-and-install'),
	updaterCheckNow: (): Promise<{ ok: true } | { ok: false; reason: string }> =>
		ipcRenderer.invoke('updater:check-now'),
	updaterOnUpdateAvailable: (cb: (p: { version: string; releaseNotes?: string | string[] | null }) => void) => {
		const ch = 'updater:update-available'
		const fn = (_e: unknown, p: unknown) =>
			cb(p as { version: string; releaseNotes?: string | string[] | null })
		ipcRenderer.on(ch, fn)
		return () => ipcRenderer.removeListener(ch, fn)
	},
	updaterOnDownloadProgress: (cb: (p: { percent: number }) => void) => {
		const ch = 'updater:download-progress'
		const fn = (_e: unknown, p: unknown) => cb(p as { percent: number })
		ipcRenderer.on(ch, fn)
		return () => ipcRenderer.removeListener(ch, fn)
	},
	updaterOnUpdateDownloaded: (cb: (p: { version: string }) => void) => {
		const ch = 'updater:update-downloaded'
		const fn = (_e: unknown, p: unknown) => cb(p as { version: string })
		ipcRenderer.on(ch, fn)
		return () => ipcRenderer.removeListener(ch, fn)
	},
	updaterOnError: (cb: (p: { message: string }) => void) => {
		const ch = 'updater:error'
		const fn = (_e: unknown, p: unknown) => cb(p as { message: string })
		ipcRenderer.on(ch, fn)
		return () => ipcRenderer.removeListener(ch, fn)
	},
	updaterOnUpdateNotAvailable: (cb: () => void) => {
		const ch = 'updater:update-not-available'
		const fn = () => cb()
		ipcRenderer.on(ch, fn)
		return () => ipcRenderer.removeListener(ch, fn)
	},
})

// 补充类型声明（避免Vue里报类型错误）
declare global {
	interface Window {
		electronAPI: {
			setWindowPosition: (x: number, y: number) => Promise<void>
			getWindowPosition: () => Promise<[x: number, y: number]>
			createNoteWindow: () => Promise<void>
			closeNoteWindow: () => Promise<void>
			maxNoteWindow: () => Promise<void>
			minNoteWindow: () => Promise<void>
			restoreNoteWindow: () => Promise<void>
			closeScratchWindow: () => Promise<void>
			getConfig: (path: string) => Promise<UIConfig>
			setConfig: (path: string, config: any) => Promise<boolean>
			getSetting: (path: string) => Promise<SettingConfig>
			setSetting: (path: string, config: SettingConfig) => Promise<boolean>
			saveFile: (name: string, type: string, content: string, dir: string) => Promise<boolean>
			openFile: (name: string, dir: string) => Promise<string>
			openAllFiles: (dir: String) => Promise<{name: string, type: string}[]>
			deleteFile: (name: string, dir: string) => Promise<boolean>
			renameWorkspaceFile: (oldRel: string, newName: string, newType: string, dir: string) => Promise<boolean>
			openTerminalAt: (folderPath: string) => Promise<boolean>
			pickWorkspaceFolder: () => Promise<string | null>
			pickFileToOpen: () => Promise<{
				fullPath: string
				dir: string
				name: string
				type: string
			} | null>
			stickyGetLastWorkspace: () => Promise<string | null>
			stickySetLastWorkspace: (folder: string | null) => Promise<void>
			getPackagedInfo: () => Promise<{ isPackaged: boolean; version: string }>
			updaterDownload: () => Promise<boolean>
			updaterQuitAndInstall: () => Promise<void>
			updaterCheckNow: () => Promise<{ ok: true } | { ok: false; reason: string }>
			updaterOnUpdateAvailable: (
				cb: (p: { version: string; releaseNotes?: string | string[] | null }) => void
			) => () => void
			updaterOnDownloadProgress: (cb: (p: { percent: number }) => void) => () => void
			updaterOnUpdateDownloaded: (cb: (p: { version: string }) => void) => () => void
			updaterOnError: (cb: (p: { message: string }) => void) => () => void
			updaterOnUpdateNotAvailable: (cb: () => void) => () => void
		}
	}
}