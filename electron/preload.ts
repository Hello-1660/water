import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('electronAPI', {
// 	on(...args: Parameters<typeof ipcRenderer.on>) {
// 		const [channel, listener] = args
// 		return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
// 	},
// 	off(...args: Parameters<typeof ipcRenderer.off>) {
// 		const [channel, ...omit] = args
// 		return ipcRenderer.off(channel, ...omit)
// 	},
// 	send(...args: Parameters<typeof ipcRenderer.send>) {
// 		const [channel, ...omit] = args
// 		return ipcRenderer.send(channel, ...omit)
// 	},
// 	invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
// 		const [channel, ...omit] = args
// 		return ipcRenderer.invoke(channel, ...omit)
// 	},

	// You can expose other APTs you need here.
	// ...

	setWindowPosition: (x: number, y: number): Promise<void> => ipcRenderer.invoke('window:set-position', x, y),
	getWindowPosition: (): Promise<[x: number, y: number]> => ipcRenderer.invoke('window:get-position')
	
})

// 补充类型声明（避免Vue里报类型错误）
declare global {
	interface Window {
		electronAPI: {
			setWindowPosition: (x: number, y: number) => Promise<void>
			getWindowPosition: () => Promise<[x: number, y: number]>
		}
	}
}