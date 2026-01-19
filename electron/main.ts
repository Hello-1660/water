import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import { UIConfig } from '../src/config/Config'
import path from 'node:path'
import fs from 'node:fs/promises'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

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

let win: BrowserWindow | null
let noteWin: BrowserWindow | null
let isStorage: boolean = false

async function createWindow() {
	const position: [number, number] | null = await getPosition()
	const size: [number, number] | null = await initSize()

	const wSize: number = size ? size[0] : 800
	const hSize: number = size ? size[1] : 600

	win = new BrowserWindow({
		icon: path.join(process.env.VITE_PUBLIC, 'wind.ico'),
		frame: false,
		width: wSize,
		height: hSize,
		resizable: false,
		transparent: true,
		show: false,
		skipTaskbar: true,
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
				storagePosition()
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

	ipcMain.handle('config:get', async (_, path: string): Promise<UIConfig | null> => {
		return await readConfig(path)
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
		win?.show()
	})
}


async function createNoteWindow() {
	noteWin = new BrowserWindow({
		icon: path.join(process.env.VITE_PUBLIC, 'wind.ico'),
		frame: false,
		width: 1400,
		height: 1000,
		resizable: false,
		show: false,
		webPreferences: {
			preload: path.join(MAIN_DIST, 'preload.mjs'),
			nodeIntegration: false,
			contextIsolation: true
		},
	})

	
	// 先移除，避免报错
	ipcMain.removeHandler('window:close-note-window')
	ipcMain.removeHandler('window:max-note-window')
	ipcMain.removeHandler('window:min-note-window')
	ipcMain.removeHandler('window:restore-note-window')


	ipcMain.handle('window:close-note-window', () => {
		if (!noteWin) return

		noteWin.close()
		noteWin = null
	})

	ipcMain.handle('window:max-note-window', () => {
		if (!noteWin) return

		noteWin.maximize()
	})

	ipcMain.handle('window:min-note-window', () => {
		if (!noteWin) return

		noteWin.minimize()
	})

	ipcMain.handle('window:restore-note-window', () => {
		if (!noteWin) return

		noteWin.restore()
	})


	if (VITE_DEV_SERVER_URL) {
		noteWin.loadURL(VITE_DEV_SERVER_URL + '/note')
	} else {
		noteWin.loadFile(path.join(RENDERER_DIST, 'note.html'))
	}

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
	}
})

app.whenReady().then(createWindow)


async function storagePosition(): Promise<void> {
	const uiConfig: UIConfig | null = await readConfig('')

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


async function initSize(): Promise<[number, number] | null> {
	const config = await readConfig('')
	if (!config) return Promise.resolve(null)

	const timeFontSize: number = config.mainConfig.time.fontSize
	const TimeFontNumber: number = 5
	const dataFontSize: number = config.mainConfig.date.fontSize
	const dataFontNumber: number = config.mainConfig.date.content.length ? config.mainConfig.date.content.length : 12

	const spacing: number = 30

	const width = Math.max((timeFontSize * TimeFontNumber + spacing), (dataFontSize * dataFontNumber + spacing))
	const height = timeFontSize + dataFontSize + spacing * 2

	return Promise.resolve([width / 2, height])
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


async function writeConfig(path: string, config: UIConfig): Promise<void> {
	try {
		if (path === '') path = process.env.APP_ROOT + '/config.json'

		await fs.writeFile(path, JSON.stringify(config, null, 2), 'utf-8')
	} catch (error) {
		console.error(error)
	}
}


// 防止界面拖拽卡顿
if (process.platform === 'win32') {
	app.commandLine.appendSwitch('high-dpi-support', 'true')
	app.commandLine.appendSwitch('force-device-scale-factor', '1')
}