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
			getConfig: (path: string) => Promise<UIConfig>
			setConfig: (path: string, config: any) => Promise<boolean>
			getSetting: (path: string) => Promise<SettingConfig>
			setSetting: (path: string, config: SettingConfig) => Promise<boolean>
			saveFile: (name: string, type: string, content: string, dir: string) => Promise<boolean>
			openFile: (name: string, dir: string) => Promise<string>
			openAllFiles: (dir: String) => Promise<{name: string, type: string}[]>
			deleteFile: (name: string, dir: string) => Promise<boolean>
			pickWorkspaceFolder: () => Promise<string | null>
			pickFileToOpen: () => Promise<{
				fullPath: string
				dir: string
				name: string
				type: string
			} | null>
			stickyGetLastWorkspace: () => Promise<string | null>
			stickySetLastWorkspace: (folder: string | null) => Promise<void>
		}
	}
}