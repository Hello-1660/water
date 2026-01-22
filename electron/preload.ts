import { ipcRenderer, contextBridge } from 'electron'
import { UIConfig } from '../src/config/Config'
import { get } from 'node:http'
import { s, S } from 'vue-router/dist/router-CWoNjPRp.mjs'

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
	// 保存文件
	saveFile: (name: string, content: string[]): Promise<boolean> => ipcRenderer.invoke('file:save', name, content),
	// 获取单个文件
	getFile: (name: string): Promise<string> => ipcRenderer.invoke('file:get', name),
	// 获取所有文件信息
	getFiles: (): Promise<string[]> => ipcRenderer.invoke('file:get-files'),
	// 删除文件
	deleteFile: (name: string): Promise<boolean> => ipcRenderer.invoke('file:delete', name),
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
			saveFile: (name: string, content: string[]) => Promise<boolean>
			getFile: (name: string) => Promise<string>
			getFiles: () => Promise<string[]>
			deleteFile: (name: string) => Promise<boolean>
		}
	}
}