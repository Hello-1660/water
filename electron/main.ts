import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import { UIConfig, SettingConfig } from '../src/config/Config'
import path from 'node:path'
import fs from 'node:fs/promises'


const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATADIR = 'data'
const TODODIR = 'todo'

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
let isStorage: boolean = false

async function createWindow() {
	const position: [number, number] | null = await getPosition()
	const size: [number, number] | null = await initSize()

	const wSize: number = size ? size[0] : 800
	const hSize: number = size ? size[1] : 600

	win = new BrowserWindow({
		icon: path.join(process.env.VITE_PUBLIC, 'water.ico'),
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


	noteWin.webContents.on('before-input-event', (event, input) => {
    	// 拦截 Ctrl++ / Ctrl+- / Ctrl+0 这三个缩放快捷键
    	if (input.control && ['=', '-', '0'].includes(input.key)) {
      		event.preventDefault() // 阻止Electron默认缩放行为
    	}
  	})
	
	// 先移除，避免报错
	ipcMain.removeHandler('window:close-note-window')
	ipcMain.removeHandler('window:max-note-window')
	ipcMain.removeHandler('window:min-note-window')
	ipcMain.removeHandler('window:restore-note-window')
	ipcMain.removeHandler('file:save')
	ipcMain.removeHandler('file:open')
	ipcMain.removeHandler('file:open-all')
	ipcMain.removeHandler('file:delete')
	ipcMain.removeHandler('setting:get')
	ipcMain.removeHandler('config:get')
	ipcMain.removeHandler('setting:set')
	ipcMain.removeHandler('config:set')




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

	ipcMain.handle('file:save', (_, name: string, type: string, content: string, dir: string = DATADIR): Promise<boolean> => {
		return saveFile(name, type, content, dir)
	})

	ipcMain.handle('file:open', async (_, name: string, dir: string = DATADIR) => {
		return await getFile(name, dir)
	})

	ipcMain.handle('file:open-all', async (_, dir: string = DATADIR) => {
		return await getAllFileList(dir)
	})

	ipcMain.handle('file:delete', async (_, name: string, dir: string = DATADIR) => {
		return await deleteFile(name, dir)
	})


	ipcMain.handle('setting:get', async (_, path: string) => {
		return await readSetting(path)
	})

	ipcMain.handle('config:get', async (_, path: string): Promise<UIConfig | null> => {
		return await readConfig(path)
	})

	ipcMain.handle('config:set', async (_, path: string, config: any) => {
		return writeConfig(path, config)
	})

	ipcMain.handle('setting:set', async (_, path: string, config: SettingConfig) => {
		return writeSetting(path, config)
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

app.whenReady().then(async () => {
	await createAppDataDir()
	await createAppDataDir(TODODIR)

	const setting = await readSetting('')

	app.setLoginItemSettings({
		openAtLogin: !!setting?.setting.autostart,
		openAsHidden: true
	})

	createNoteWindow()

	if (setting?.setting?.showClock) {
		createWindow()
	}
})


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

async function readSetting(path: string): Promise<SettingConfig | null> {
	try {
		if (path === '') path = process.env.APP_ROOT + '/setting.json'

		await fs.access(path)

		const data = await fs.readFile(path, 'utf-8')
		const parseConfig = JSON.parse(data)


		return new SettingConfig(parseConfig)
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

// 创建数据文件夹
async function createAppDataDir(dir: string = DATADIR) {
	const appDataDir = path.join(getInstallSiblingDir(), dir)
	const exist = await isFolderExist(appDataDir)

	if (!exist) {
		await fs.mkdir(appDataDir, { recursive: true })
	}
}



// 保存文件
function saveFile(name: string, type: string, file: string, dir: string = DATADIR): Promise<boolean> {
	return new Promise(async (resolve, reject) => {
		try {
			const savePath = path.join(getInstallSiblingDir(), dir, name + '.' + type)
			await fs.writeFile(savePath, file, { encoding: 'utf8' })
			
			resolve(true);
		} catch (error) {
			const errMsg = `保存文件失败：${(error as Error).message}`
			reject(new Error(errMsg))
		}
	});
} 


// 获取文件
function getFile(name: string, dir: string = DATADIR): Promise<string> {
	return new Promise(async (resolve, reject) => {
		try {
			const filePath = path.join(getInstallSiblingDir(), dir, name)
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

// 获取所有文件
function getAllFileList(dir: string = DATADIR): Promise<FileType[]> {
	return new Promise(async (resolve, reject) => {
		try {
			const filePath = path.join(getInstallSiblingDir(), dir)
			const dirents = await fs.readdir(filePath, { withFileTypes: true })
			
			const fileList: FileType[] = await Promise.all(
				dirents
					.filter(dirent => dirent.isFile()) 
					.map(async (dirent) => {
						const data = dirent.name.split('.')
						const name = data[0]
						const type = data[1]

						return {
							name: name,
							type: type
						}
					})
			)

			resolve(fileList)
		} catch (error) {
			reject([])
		}
	})
}



function deleteFile(name: string, dir: string = DATADIR): Promise<boolean> {
	return new Promise(async (resolve, reject) => {
		try {
			const filePath = path.join(getInstallSiblingDir(), dir, name)
			await fs.unlink(filePath)
			resolve(true)
		} catch (error) {
			reject(false)
		}
	})
} 






// 防止界面拖拽卡顿
if (process.platform === 'win32') {
	app.commandLine.appendSwitch('high-dpi-support', 'true')
	app.commandLine.appendSwitch('force-device-scale-factor', '1')
}