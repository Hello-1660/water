import { app, BrowserWindow, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const require = createRequire(import.meta.url)
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

function createWindow() {
	win = new BrowserWindow({
		icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
		frame: false,
		width: 800,
		height: 600,
		resizable: false,
		transparent: true, 
		show: false,
		webPreferences: {
			preload: path.join(__dirname, 'preload.mjs'),
			nodeIntegration: false,
			contextIsolation: true
		},
	})

	ipcMain.handle('window:set-position', (_, x: number, y: number) => {
		// setPosition的第二个参数设为true，避免窗口超出屏幕
		if (win) win.setPosition(x, y, false)
	})

	ipcMain.handle('window:get-position', () => {
  		if (win) {
			return win.getPosition()
		} else {
			return [0, 0]
		}
	})

	// Test active push message to Renderer-process.
	win.webContents.on('did-finish-load', () => {
		win?.webContents.send('main-process-message', (new Date).toLocaleString())
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

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
		win = null
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


if (process.platform === 'win32') {
	app.commandLine.appendSwitch('high-dpi-support', 'true')
	app.commandLine.appendSwitch('force-device-scale-factor', '1')
}