import { ipcRenderer, contextBridge } from 'electron'
import { UIConfig } from '../src/config/Config'

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
	getConfig: (path: string): Promise<UIConfig> => ipcRenderer.invoke('config:get', path)
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
		}
	}
}