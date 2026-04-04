import { app, BrowserWindow, Tray, Menu, ipcMain, dialog, screen, globalShortcut, shell } from 'electron'
import { autoUpdater } from 'electron-updater'
import { execFileSync, spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { UIConfig, SettingConfig } from '../src/config/Config'
import path from 'node:path'
import fs from 'node:fs/promises'

/** 主时钟窗口：不抢焦点、尽量叠在普通窗口之下（Windows 用 SetWindowPos） */
const SWP_NOSIZE = 0x0001
const SWP_NOMOVE = 0x0002
const SWP_NOACTIVATE = 0x0010
const SWP_NOZORDER_BOTTOM = SWP_NOSIZE | SWP_NOMOVE | SWP_NOACTIVATE

function sendWin32ClockWindowToBack(w: BrowserWindow) {
	const handleBuf = w.getNativeWindowHandle()
	const hwnd =
		handleBuf.length >= 8
			? Number(handleBuf.readBigUInt64LE(0))
			: handleBuf.readUInt32LE(0)
	const ps = [
		'Add-Type @"',
		'using System;',
		'using System.Runtime.InteropServices;',
		'public class Z {',
		'[DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr h, IntPtr a, int x, int y, int cx, int cy, uint f);',
		'}',
		'"@',
		`[Z]::SetWindowPos([IntPtr]${hwnd}, [IntPtr]1, 0, 0, 0, 0, ${SWP_NOZORDER_BOTTOM})`,
	].join('\r\n')
	const encoded = Buffer.from(ps, 'utf16le').toString('base64')
	execFileSync('powershell.exe', ['-NoProfile', '-WindowStyle', 'Hidden', '-EncodedCommand', encoded], {
		windowsHide: true,
		timeout: 10000,
		stdio: 'ignore',
	})
}

function showClockWindowBehindOthers() {
	if (!win) return
	win.showInactive()
	if (process.platform === 'win32') {
		setImmediate(() => {
			if (!win?.isVisible()) return
			try {
				sendWin32ClockWindowToBack(win)
			} catch (e) {
				console.error('sendWin32ClockWindowToBack:', e)
			}
		})
	}
}


const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATADIR = 'data'
const TODODIR = 'todo'
const TIMETABLE = 'timeTable'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST


let isDev: boolean = process.env.NODE_ENV === 'development'


let win: BrowserWindow | null
let noteWin: BrowserWindow | null
/** 便签窗口「铺满工作区」前的大小，用于恢复（避免 maximize() 在无边框下盖住任务栏） */
let noteWinSavedBounds: { x: number; y: number; width: number; height: number } | null = null
let noteWinFillsWorkArea = false
let isStorage: boolean = false
// 系统托盘
let tray: Tray | null

/** 是否在启动时向 GitHub 检查更新（来自 setting.json） */
let updateCheckEnabled = false
let autoUpdaterHooksAttached = false

function attachAutoUpdaterBridge(): void {
	if (autoUpdaterHooksAttached) return
	autoUpdaterHooksAttached = true
	autoUpdater.autoDownload = false
	autoUpdater.autoInstallOnAppQuit = true

	autoUpdater.on('update-available', (info) => {
		if (!noteWin || noteWin.isDestroyed()) return
		noteWin.webContents.send('updater:update-available', {
			version: info.version,
			releaseNotes: info.releaseNotes,
		})
	})

	autoUpdater.on('update-not-available', () => {
		if (!noteWin || noteWin.isDestroyed()) return
		noteWin.webContents.send('updater:update-not-available')
	})

	autoUpdater.on('download-progress', (progress) => {
		if (!noteWin || noteWin.isDestroyed()) return
		noteWin.webContents.send('updater:download-progress', {
			percent: progress.percent,
		})
	})

	autoUpdater.on('update-downloaded', (info) => {
		if (!noteWin || noteWin.isDestroyed()) return
		noteWin.webContents.send('updater:update-downloaded', {
			version: info.version,
		})
	})

	autoUpdater.on('error', (err) => {
		console.error('autoUpdater:', err)
		if (!noteWin || noteWin.isDestroyed()) return
		noteWin.webContents.send('updater:error', { message: err.message })
	})
}

function scheduleUpdateCheckIfEnabled(): void {
	if (!app.isPackaged || !updateCheckEnabled) return
	setTimeout(() => {
		autoUpdater.checkForUpdates().catch((e) => console.warn('checkForUpdates:', e))
	}, 4500)
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  	app.quit()
}


async function createWindow() {
	if (win) return

	let p: string = ''

	if (!isDev) p = path.join(getInstallSiblingDir(), 'config.json') 
	

	const position: [number, number] | null = await getPosition()
	const size: [number, number] | null = await initSize(p)

	const wSize: number = size ? size[0] : 800
	const hSize: number = size ? size[1] : 500

	win = new BrowserWindow({
		icon: path.join(process.env.VITE_PUBLIC, 'water.ico'),
		frame: false,
		width: wSize,
		height: hSize,
		resizable: false,
		transparent: true,
		show: false,
		skipTaskbar: true,
		focusable: false,
		webPreferences: {
			preload: path.join(MAIN_DIST, 'preload.mjs'),
			nodeIntegration: false,
			contextIsolation: true
		},
	})

	if (!position || !position[0] || !position[1]) {
		win.center()
	} else {
		win.setPosition(position[0], position[1])
	}

	ipcMain.handle('window:set-position', (_, x: number, y: number) => {
		// setPosition的第二个参数设为true，避免窗口超出屏幕
		if (win) win.setPosition(x, y, true)

		if (!isStorage) {
			isStorage = true

			setTimeout(() => {
				storagePosition(p)
				isStorage = false
			}, 500)
		}
	})

	ipcMain.handle('window:get-position', () => {
		if (win) {
			return win.getPosition()
		} else {
			return [0, 0]
		}
	})

	
	ipcMain.handle('window:create-note-window', () => {
		if (noteWin) {
			noteWin.show()
			return
		} 

		createNoteWindow()
	})


	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL)
	} else {
		// win.loadFile('dist/index.html')
		win.loadFile(path.join(RENDERER_DIST, 'index.html'))
	}

	win.on('ready-to-show', () => {
		showClockWindowBehindOthers()
	})
}


async function createNoteWindow() {
	if (noteWin) {
		noteWin.show()
		return
	}

	noteWin = new BrowserWindow({
		icon: path.join(process.env.VITE_PUBLIC, 'water.ico'),
		frame: false,
		width: 1400,
		height: 1000,
		resizable: false,
		show: false,
		webPreferences: {
			preload: path.join(MAIN_DIST, 'preload.mjs'),
			nodeIntegration: false,
			contextIsolation: true,
			webSecurity: false, 
      		spellcheck: false
		},
	})


	if (VITE_DEV_SERVER_URL) {
		noteWin.loadURL(VITE_DEV_SERVER_URL + '/note')
	} else {
		noteWin.loadFile(path.join(RENDERER_DIST, 'note.html'))
	}

	const resetNotePageZoom = (): void => {
		if (noteWin && !noteWin.isDestroyed()) {
			noteWin.webContents.setZoomFactor(1)
		}
	}
	noteWin.webContents.on('did-finish-load', resetNotePageZoom)
	noteWin.webContents.on('zoom-changed', resetNotePageZoom)

	// 不在此用 before-input-event 拦截 Ctrl+/-/0：preventDefault 会导致按键无法进入渲染进程，TipTap 字号快捷键失效。
	// 页面缩放由渲染层 keydown capture + 必要时 setZoomFactor(1) 处理。

	// 先移除，避免报错
	ipcMain.removeHandler('window:close-note-window')
	ipcMain.removeHandler('window:max-note-window')
	ipcMain.removeHandler('window:min-note-window')
	ipcMain.removeHandler('window:restore-note-window')
	ipcMain.removeHandler('file:save')
	ipcMain.removeHandler('file:open')
	ipcMain.removeHandler('file:open-all')
	ipcMain.removeHandler('file:open-workspace-tree')
	ipcMain.removeHandler('file:delete')
	ipcMain.removeHandler('file:rename')
	ipcMain.removeHandler('shell:open-terminal-at')
	ipcMain.removeHandler('dialog:open-directory')
	ipcMain.removeHandler('dialog:open-file')
	ipcMain.removeHandler('sticky:get-last-workspace')
	ipcMain.removeHandler('sticky:set-last-workspace')
	ipcMain.removeHandler('setting:get')
	ipcMain.removeHandler('config:get')
	ipcMain.removeHandler('setting:set')
	ipcMain.removeHandler('config:set')




	ipcMain.handle('window:close-note-window', () => {
		if (!noteWin) return

		noteWin.close()
		noteWin = null
		noteWinSavedBounds = null
		noteWinFillsWorkArea = false
	})



	ipcMain.handle('window:max-note-window', () => {
		if (!noteWin || noteWinFillsWorkArea) return

		noteWinSavedBounds = noteWin.getBounds()
		const { workArea } = screen.getDisplayMatching(noteWin.getBounds())
		noteWin.setBounds({ ...workArea })
		noteWinFillsWorkArea = true
	})

	ipcMain.handle('window:min-note-window', () => {
		if (!noteWin) return

		noteWin.minimize()
	})

	ipcMain.handle('window:restore-note-window', () => {
		if (!noteWin || !noteWinFillsWorkArea) return

		if (noteWinSavedBounds) {
			noteWin.setBounds(noteWinSavedBounds)
		}
		noteWinSavedBounds = null
		noteWinFillsWorkArea = false
	})

	ipcMain.handle('file:save', (_, name: string, type: string, content: string, dir: string = DATADIR): Promise<boolean> => {
		return saveFile(name, type, content, dir)
	})

	ipcMain.handle('file:open', async (_, name: string, dir: string = DATADIR) => {
		return await getFile(name, dir)
	})

	ipcMain.handle('file:open-all', async (_, dir: string = DATADIR) => {
		return await getAllFileList(dir)
	})

	ipcMain.handle('file:open-workspace-tree', async (_, dir: string = DATADIR) => {
		return await getWorkspaceTree(dir)
	})

	ipcMain.handle('file:delete', async (_, name: string, dir: string = DATADIR) => {
		return await deleteFile(name, dir)
	})

	ipcMain.handle(
		'file:rename',
		async (_, oldRel: string, newName: string, newType: string, dir: string = DATADIR): Promise<boolean> => {
			return await renameWorkspaceFile(dir, oldRel, newName, newType)
		}
	)

	ipcMain.handle('shell:open-terminal-at', async (_, folderPath: string): Promise<boolean> => {
		const abs = resolveWorkspaceDir(folderPath)
		if (!(await isFolderExist(abs))) return false
		openTerminalAtFolder(abs)
		return true
	})

	ipcMain.handle('dialog:open-directory', async (event) => {
		const win = BrowserWindow.fromWebContents(event.sender)
		if (!win) return null
		const { canceled, filePaths } = await dialog.showOpenDialog(win, {
			properties: ['openDirectory', 'createDirectory'],
		})
		if (canceled || !filePaths[0]) return null
		return filePaths[0]
	})

	ipcMain.handle('dialog:open-file', async (event) => {
		const win = BrowserWindow.fromWebContents(event.sender)
		if (!win) return null
		const { canceled, filePaths } = await dialog.showOpenDialog(win, {
			properties: ['openFile'],
		})
		if (canceled || !filePaths[0]) return null
		const fullPath = filePaths[0]
		const parsed = path.parse(fullPath)
		const ext = parsed.ext ? parsed.ext.slice(1) : ''
		const type = ext || 'txt'
		return {
			fullPath,
			dir: parsed.dir,
			name: parsed.name,
			type,
		}
	})

	ipcMain.handle('sticky:get-last-workspace', async () => {
		return await readStickyLastFolder()
	})

	ipcMain.handle('sticky:set-last-workspace', async (_, folder: string | null) => {
		await writeStickyLastFolder(folder)
	})


	ipcMain.handle('setting:get', async (_, p: string) => {
		if (!isDev) p = path.join(getInstallSiblingDir(), 'setting.json') 
		return await readSetting(p)
	})

	ipcMain.handle('config:get', async (_, p: string): Promise<UIConfig | null> => {
		if (!isDev) p = path.join(getInstallSiblingDir(), 'config.json') 
		return await readConfig(p)
	})

	ipcMain.handle('config:set', async (_, p: string, config: any) => {
		if (!isDev) p = path.join(getInstallSiblingDir(), 'config.json') 
		return writeConfig(p, config)
	})

	ipcMain.handle('setting:set', async (_, p: string, config: SettingConfig) => {
		if (!isDev) p = path.join(getInstallSiblingDir(), 'setting.json')
		const ok = await writeSetting(p, config)
		if (ok && app.isPackaged && config?.setting) {
			const next = config.setting as { checkForUpdates?: boolean }
			updateCheckEnabled = !!next.checkForUpdates
			if (updateCheckEnabled) {
				setTimeout(() => {
					autoUpdater.checkForUpdates().catch(() => {})
				}, 1200)
			}
		}
		return ok
	})


	noteWin.on('ready-to-show', () => {
		noteWin?.show()
	})
}



// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
		win = null
		noteWin = null
	}
})

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
		createNoteWindow()
	}
})

app.commandLine.appendSwitch('no-default-window')

const SCRATCH_HOTKEY = 'CommandOrControl+Shift+N'

function createScratchEditorWindow(): void {
	const scratchWin = new BrowserWindow({
		width: 750,
		height: 800,
		show: false,
		frame: false,
		icon: path.join(process.env.VITE_PUBLIC, 'water.ico'),
		webPreferences: {
			preload: path.join(MAIN_DIST, 'preload.mjs'),
			nodeIntegration: false,
			contextIsolation: true,
		},
	})

	if (VITE_DEV_SERVER_URL) {
		scratchWin.loadURL(`${VITE_DEV_SERVER_URL}/scratch.html`)
	} else {
		scratchWin.loadFile(path.join(RENDERER_DIST, 'scratch.html'))
	}

	const resetScratchPageZoom = (): void => {
		if (!scratchWin.isDestroyed()) {
			scratchWin.webContents.setZoomFactor(1)
		}
	}
	scratchWin.webContents.on('did-finish-load', resetScratchPageZoom)
	scratchWin.webContents.on('zoom-changed', resetScratchPageZoom)

	scratchWin.once('ready-to-show', () => {
		scratchWin.show()
	})
}

function registerScratchHotkey(): void {
	const ok = globalShortcut.register(SCRATCH_HOTKEY, () => {
		createScratchEditorWindow()
	})
	if (!ok) {
		console.error('全局快捷键注册失败:', SCRATCH_HOTKEY)
	}
}

app.whenReady().then(async () => {
	await createAppDataDir()
	await createAppDataDir(TODODIR)
	await createAppDataDir(TIMETABLE)
	await initConfigFile()
	await initSettingFile()

	createTray()

	const p = isDev ? '' : path.join(getInstallSiblingDir(), 'setting.json')

	const setting = await readSetting(p)

	const st = setting?.setting as { autostart?: boolean; checkForUpdates?: boolean } | undefined
	updateCheckEnabled = !!(st && st.checkForUpdates)

	if (app.isPackaged) {
		attachAutoUpdaterBridge()
		scheduleUpdateCheckIfEnabled()
	}

	if (!isDev) {
		app.setLoginItemSettings({
			openAtLogin: !!setting?.setting.autostart,
			openAsHidden: true
		})
	}

	ipcMain.removeHandler('updater:download')
	ipcMain.removeHandler('updater:quit-and-install')
	ipcMain.removeHandler('updater:check-now')
	ipcMain.removeHandler('app:get-packaged-info')

	ipcMain.handle('updater:download', async () => {
		if (!app.isPackaged) return false
		await autoUpdater.downloadUpdate()
		return true
	})

	ipcMain.handle('updater:quit-and-install', () => {
		if (!app.isPackaged) return Promise.resolve()
		autoUpdater.quitAndInstall(false, true)
		return Promise.resolve()
	})

	ipcMain.handle('updater:check-now', async () => {
		if (!app.isPackaged) return { ok: false as const, reason: 'not-packaged' as const }
		await autoUpdater.checkForUpdates()
		return { ok: true as const }
	})

	ipcMain.handle('app:get-packaged-info', () => ({
		isPackaged: app.isPackaged,
		version: app.getVersion(),
	}))

	ipcMain.removeHandler('shell:open-folder-location')
	ipcMain.handle(
		'shell:open-folder-location',
		async (_, workspaceRoot: string, relFolderPath: string): Promise<boolean> => {
			const root = resolveWorkspaceDir(workspaceRoot)
			const segments = relFolderPath.replace(/\\/g, '/').split('/').filter(Boolean)
			const abs = path.join(root, ...segments)
			if (!(await isFolderExist(abs))) return false
			const err = await shell.openPath(abs)
			return err === ''
		}
	)

	ipcMain.handle('window:close-scratch', (event) => {
		const w = BrowserWindow.fromWebContents(event.sender)
		if (w && !w.isDestroyed()) w.close()
	})

	createNoteWindow()
	registerScratchHotkey()

	if (setting?.setting?.showClock) {
		createWindow()
		noteWin?.hide()

		// 添加静默检查
		
	}
})

app.on('will-quit', () => {
	globalShortcut.unregisterAll()
})


async function storagePosition(path: string): Promise<void> {
	const uiConfig: UIConfig | null = await readConfig(path)

	if (!uiConfig || !win) return

	const position: number[] = win.getPosition()
	uiConfig.mainConfig.position.x = position[0]
	uiConfig.mainConfig.position.y = position[1]

	await writeConfig('', uiConfig)
}

async function getPosition(): Promise<[number, number] | null> {
	const uiConfig: UIConfig | null = await readConfig('')

	if (!uiConfig || !uiConfig.mainConfig.position) return Promise.resolve(null)

	return Promise.resolve([uiConfig.mainConfig.position.x, uiConfig.mainConfig.position.y])
}


async function initSize(path: string): Promise<[number, number] | null> {
	const config = await readConfig(path)
	if (!config) return Promise.resolve(null)

	const timeFontSize: number = config.mainConfig.time.fontSize
	const TimeFontNumber: number = 5
	const dataFontSize: number = config.mainConfig.date.fontSize
	const dataFontNumber: number = config.mainConfig.date.content.length ? config.mainConfig.date.content.length : 12

	const spacing: number = 30

	const width = Math.max((timeFontSize * TimeFontNumber + spacing), (dataFontSize * dataFontNumber + spacing))

	const height = timeFontSize + dataFontSize + spacing * 2

	return Promise.resolve([width + 100 , height + 50])
}



async function readConfig(path: string): Promise<UIConfig | null> {
	try {
		if (path === '') path = process.env.APP_ROOT + '/config.json'

		await fs.access(path)

		const data = await fs.readFile(path, 'utf-8')
		const parseConfig = JSON.parse(data)


		return new UIConfig(parseConfig)
	} catch (error) {
		console.error(error)
		return null
	}
}

async function readSetting(path: string): Promise<SettingConfig | null> {
	try {
		if (path === '') path = process.env.APP_ROOT + '/setting.json'

		await fs.access(path)

		const data = await fs.readFile(path, 'utf-8')
		const parseConfig = JSON.parse(data)
		const merged = {
			setting: {
				autostart: false,
				dark: false,
				showClock: true,
				checkForUpdates: false,
				...(parseConfig.setting ?? {}),
			},
		}

		return new SettingConfig(merged)
	} catch (error) {
		console.error(error)
		return null
	}
}


async function writeConfig(path: string, config: any): Promise<boolean> {
	try {
		if (path === '') path = process.env.APP_ROOT + '/config.json'
	  	const old = await readConfig(path)

		if (old === null) {
			await fs.writeFile(path, JSON.stringify(config, null, 2), 'utf-8')

		} else {
			const newConfig = deepMerge(old, config)
			await fs.writeFile(path, JSON.stringify(newConfig, null, 2), 'utf-8')
		}

		return true
	} catch (error) {
		console.error(error)
		return false
	}
}

async function writeSetting(path: string, setting: SettingConfig): Promise<boolean> { 
	try {
		if (path === '') path = process.env.APP_ROOT + '/setting.json' 

		await fs.writeFile(path, JSON.stringify(setting, null, 2), 'utf-8')
		return true
	} catch (error) {
		console.error(error)
		return false
	}
}

// 对象合并
function deepMerge<T extends object>(target: T, source: T): T {
	const merged = { ...target } as T 

	for (const key in source) {
		if (source.hasOwnProperty(key)) {
			const targetValue = target[key]
			const sourceValue = source[key]

			if (sourceValue === undefined) continue 

			if (sourceValue !== null &&
				typeof sourceValue === 'object' &&
				!Array.isArray(sourceValue) &&
				targetValue !== null &&
				typeof targetValue === 'object' &&
				!Array.isArray(targetValue)) {
				merged[key] = deepMerge(targetValue as object, sourceValue as Partial<object>) as T[Extract<keyof T, string>]
			} else {
				merged[key] = sourceValue as T[Extract<keyof T, string>]
			}
		}
	}

	return merged
}


// 获取文件保存目录
function getInstallSiblingDir(): string {
	try {
		if (isDev) {
			return path.resolve(__dirname, '../')
		}

		const exePath = app.getPath('exe')
		const exeDir = path.dirname(exePath)

		return exeDir
	} catch (error) {
		console.error('解析安装目录失败：', error)
		return app.getPath('documents')
	}
}


// 判断文件夹是否存在 
async function isFolderExist(path: string) {
	try {
		await fs.access(path, 0)
		const stats = await fs.stat(path)
		return stats.isDirectory()
	} catch (error) {
		return false
	}
}


// 判断文件是否存在
async function isFileExist(path: string) {
	try {
		await fs.access(path, 0)
		const stats = await fs.stat(path)
		return stats.isFile()
	} catch (error) {
		return false
	}
}


// 初始化配置文件
async function initConfigFile() { 
	if (isDev) return 

	const p = path.join(getInstallSiblingDir(), 'config.json')
	
	if (await isFileExist(p)) return  

	const content = `
{
  "mainConfig": {
    "time": {
      "fontSize": 50,
      "fontColor": "#000000",
      "fontFamily": "Arial"
    },
    "date": {
      "fontSize": 50,
      "fontColor": "#000000",
      "fontFamily": "Arial",
      "content": "Hello"
    },
    "position": {
      "x": 1077,
      "y": 587
    }
  }
}`

	await fs.writeFile(p, content, 'utf-8')
}


async function initSettingFile() { 
	if (isDev) return 

	const p = path.join(getInstallSiblingDir(), 'setting.json')

	if (await isFileExist(p)) return

	const content = `
	{
		"setting": {
			"autostart": false,
			"dark": false,
			"showClock": true,
			"checkForUpdates": false
		}
	}`

	await fs.writeFile(p, content, 'utf-8')
}

// 创建数据文件夹
async function createAppDataDir(dir: string = DATADIR) {
	const appDataDir = path.join(getInstallSiblingDir(), dir)
	const exist = await isFolderExist(appDataDir)

	if (!exist) {
		await fs.mkdir(appDataDir, { recursive: true })
	}
}

function resolveWorkspaceDir(dir: string): string {
	if (!dir) {
		return path.join(getInstallSiblingDir(), DATADIR)
	}
	if (path.isAbsolute(dir)) {
		return dir
	}
	return path.join(getInstallSiblingDir(), dir)
}

function getStickyWorkspaceJsonPath() {
	return path.join(app.getPath('userData'), 'sticky-workspace.json')
}

async function readStickyLastFolder(): Promise<string | null> {
	try {
		const raw = await fs.readFile(getStickyWorkspaceJsonPath(), 'utf-8')
		const j = JSON.parse(raw) as { folder?: string | null }
		if (typeof j.folder === 'string' && j.folder.length > 0) {
			if (await isFolderExist(j.folder)) return j.folder
		}
		return null
	} catch {
		return null
	}
}

async function writeStickyLastFolder(folder: string | null) {
	const payload = JSON.stringify({ folder: folder ?? null }, null, 2)
	await fs.writeFile(getStickyWorkspaceJsonPath(), payload, 'utf-8')
}

// 保存文件（name 可含子目录，如 src/views/App，type 为扩展名）
function saveFile(name: string, type: string, file: string, dir: string = DATADIR): Promise<boolean> {
	return new Promise(async (resolve, reject) => {
		try {
			const root = resolveWorkspaceDir(dir)
			const norm = name.replace(/\\/g, '/')
			const lastSlash = norm.lastIndexOf('/')
			const dirPart = lastSlash >= 0 ? norm.slice(0, lastSlash) : ''
			const baseName = lastSlash >= 0 ? norm.slice(lastSlash + 1) : norm
			const fileName = type ? `${baseName}.${type}` : baseName
			const rel = dirPart ? `${dirPart}/${fileName}` : fileName
			const segments = rel.split('/').filter(Boolean)
			const savePath = path.join(root, ...segments)
			await fs.mkdir(path.dirname(savePath), { recursive: true })
			await fs.writeFile(savePath, file, { encoding: 'utf8' })

			resolve(true)
		} catch (error) {
			const errMsg = `保存文件失败：${(error as Error).message}`
			reject(new Error(errMsg))
		}
	})
}


// 获取文件（name 为相对路径，可含子目录）
function getFile(name: string, dir: string = DATADIR): Promise<string> {
	return new Promise(async (resolve, reject) => {
		try {
			const root = resolveWorkspaceDir(dir)
			const segments = name.replace(/\\/g, '/').split('/').filter(Boolean)
			const filePath = path.join(root, ...segments)
			const data = await fs.readFile(filePath, 'utf-8')
			resolve(data)
		} catch (error) {
			reject('')
		}
	})
}

interface FileType {
	name: string,
	type: string,
}

export interface WorkspaceTreeEntry {
	kind: 'file' | 'folder'
	/** 相对工作区根的路径，正斜杠 */
	relPath: string
	/** 展示用短名（文件名或文件夹名） */
	name: string
	/** 仅文件：扩展名不含点 */
	type?: string
	children?: WorkspaceTreeEntry[]
}

const TREE_SKIP_DIRS = new Set(['.git', 'node_modules', '.svn', 'dist', 'dist-electron', 'release'])

function toPosixRel(segments: string[]): string {
	return segments.join('/')
}

async function readWorkspaceTree(absDir: string, relSegments: string[]): Promise<WorkspaceTreeEntry[]> {
	const dirents = await fs.readdir(absDir, { withFileTypes: true })
	const entries: WorkspaceTreeEntry[] = []

	for (const d of dirents) {
		if (d.name === '.' || d.name === '..') continue
		const nextSegs = [...relSegments, d.name]
		const relPath = toPosixRel(nextSegs)
		const full = path.join(absDir, d.name)

		if (d.isDirectory()) {
			if (TREE_SKIP_DIRS.has(d.name)) continue
			const children = await readWorkspaceTree(full, nextSegs)
			entries.push({ kind: 'folder', name: d.name, relPath, children })
		} else if (d.isFile()) {
			const parsed = path.parse(d.name)
			const ext = parsed.ext ? parsed.ext.slice(1) : ''
			entries.push({ kind: 'file', name: parsed.name, type: ext, relPath })
		}
	}

	entries.sort((a, b) => {
		if (a.kind !== b.kind) return a.kind === 'folder' ? -1 : 1
		return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
	})
	return entries
}

function getWorkspaceTree(dir: string): Promise<WorkspaceTreeEntry[]> {
	return new Promise(async (resolve) => {
		try {
			const root = resolveWorkspaceDir(dir)
			const tree = await readWorkspaceTree(root, [])
			resolve(tree)
		} catch {
			resolve([])
		}
	})
}

// 获取所有文件（仅根目录一层，兼容旧逻辑）
function getAllFileList(dir: string = DATADIR): Promise<FileType[]> {
	return new Promise(async (resolve, reject) => {
		try {
			const filePath = resolveWorkspaceDir(dir)
			const dirents = await fs.readdir(filePath, { withFileTypes: true })
			
			const fileList: FileType[] = dirents
				.filter((dirent) => dirent.isFile())
				.map((dirent) => {
					const parsed = path.parse(dirent.name)
					const ext = parsed.ext ? parsed.ext.slice(1) : ''
					return {
						name: parsed.name,
						type: ext,
					}
				})

			resolve(fileList)
		} catch (error) {
			reject([])
		}
	})
}



function deleteFile(name: string, dir: string = DATADIR): Promise<boolean> {
	return new Promise(async (resolve, reject) => {
		try {
			const root = resolveWorkspaceDir(dir)
			const segments = name.replace(/\\/g, '/').split('/').filter(Boolean)
			const filePath = path.join(root, ...segments)
			await fs.unlink(filePath)
			resolve(true)
		} catch (error) {
			reject(false)
		}
	})
}

const INVALID_WIN_FILENAME = /[\\/:*?"<>|]/

async function renameWorkspaceFile(
	dir: string,
	oldRel: string,
	newName: string,
	newType: string
): Promise<boolean> {
	try {
		const root = resolveWorkspaceDir(dir)
		const trimmed = newName.trim()
		if (!trimmed || INVALID_WIN_FILENAME.test(trimmed)) return false
		const ext = newType.trim()
		const newBase = ext ? `${trimmed}.${ext}` : trimmed
		const normOld = oldRel.replace(/\\/g, '/')
		const parent = path.posix.dirname(normOld)
		const newRel = parent === '.' ? newBase : `${parent}/${newBase}`
		const oldSegments = normOld.split('/').filter(Boolean)
		const newSegments = newRel.split('/').filter(Boolean)
		const oldPath = path.join(root, ...oldSegments)
		const newPath = path.join(root, ...newSegments)
		if (path.normalize(oldPath) === path.normalize(newPath)) return true
		if (!(await isFileExist(oldPath))) return false
		if (await isFileExist(newPath)) return false
		await fs.rename(oldPath, newPath)
		return true
	} catch {
		return false
	}
}

function openTerminalAtFolder(absDir: string): void {
	if (process.platform === 'win32') {
		// Electron 是无控制台进程，直接 spawn cmd/powershell + detached 往往不会出现窗口。
		// 经「cmd /c start …」启动才会新建可见控制台（与资源管理器「在此处打开终端」一致）。
		const dirForCmd = absDir.replace(/"/g, '""')
		const psLiteral = absDir.replace(/'/g, "''")
		const opts = { detached: true, stdio: 'ignore' as const, windowsHide: false }

		const startVisibleCmd = () =>
			spawn('cmd.exe', ['/c', 'start', '', 'cmd', '/k', `cd /d "${dirForCmd}"`], opts).unref()

		const wt = spawn('wt.exe', ['-d', absDir], opts)
		wt.on('error', () => {
			// 未安装 Windows Terminal：用 start 拉起 PowerShell；失败再退回 cmd
			const viaStartPs = spawn(
				'cmd.exe',
				[
					'/c',
					'start',
					'',
					'powershell.exe',
					'-NoExit',
					'-NoProfile',
					'-Command',
					`Set-Location -LiteralPath '${psLiteral}'`,
				],
				opts
			)
			viaStartPs.on('error', () => startVisibleCmd())
			viaStartPs.unref()
		})
		wt.unref()
		return
	}
	if (process.platform === 'darwin') {
		spawn('open', ['-a', 'Terminal', absDir], { detached: true, stdio: 'ignore' }).unref()
		return
	}
	const child = spawn('gnome-terminal', ['--working-directory', absDir], {
		detached: true,
		stdio: 'ignore',
	})
	child.unref()
}



// 创建系统托盘
const createTray = () => {
	if (tray) return
	

    // 托盘图标
    const iconPath = path.join(process.env.VITE_PUBLIC, 'water.ico')

    tray = new Tray(iconPath)

    // 创建上下文菜单
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '显示/隐藏',
            click: () => {
				if (!win) return 

                if (win.isVisible()) {
                    win.hide()
                } else {
                    showClockWindowBehindOthers()
                }
            }
        },
        {
            label: '退出',
            click: () => {
                app.quit()
            }
        }
    ])


    // 托盘鼠标悬停
    tray.setToolTip('Salvation lies within')

    // 设置上下文菜单
    tray.setContextMenu(contextMenu)

    // 点击托盘隐藏或显示窗口
    tray.on('click', () => {
		if (!win) return

        if (win.isVisible()) {
            win.hide()
        } else {
            showClockWindowBehindOthers()
        }
    })
}







// 防止界面拖拽卡顿
if (process.platform === 'win32') {
	app.commandLine.appendSwitch('high-dpi-support', 'true')
	app.commandLine.appendSwitch('force-device-scale-factor', '1')
}