const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain
const Menu = electron.Menu
const path = require('path')
const url = require('url')
const translate = require('google-translate-api')
const about = require('./about')
const Settings = require('./electron-settings-wrap')
const settings = new Settings({
	bounds: {
		mainWindow: {
			x: null,
			y: null
		},
		'Google画像検索': {
			src: {
				width: 800,
				height: 600,
				x: 0,
				y: 0
			},
			tr: {
				width: 800,
				height: 600,
				x: 800,
				y: 0
			}
		},
		'Pinterest': {
			src: {
				width: 800,
				height: 600,
				x: 10,
				y: 50
			},
			tr: {
				width: 800,
				height: 600,
				x: 810,
				y: 50
			}
		},
		'Tumblr': {
			src: {
				width: 800,
				height: 600,
				x: 20,
				y: 100
			},
			tr: {
				width: 800,
				height: 600,
				x: 820,
				y: 100
			}
		}
	},
	shows: {
		'Google画像検索': true,
		'Pinterest': true,
		'Tumblr': true
	},
	langs: {
		from: 'ja',
		to: 'en'
	}
})

const base_url = {
	'Google画像検索': 'https://www.google.co.jp/search?hl=ja&tbm=isch&q=%q',
	'Pinterest': 'https://www.pinterest.jp/search/pins/?q=%q',
	'Tumblr': 'https://www.tumblr.com/search/%q'
}
const template = (() => {
	if (process.platform === 'darwin') {
		return [
			{
				label: app.getName(),
				submenu: [
					{
						label: `${app.getName()}について`,
						click(){ about(mainWindow) }
					},
					{type: 'separator'},
					{
						label: 'サービス',
						role: 'services',
						submenu: []
					},
					{type: 'separator'},
					{
						label: `${app.getName()}を隠す`,
						accelerator: 'Command+H',
						click: () => app.hide()
					},
					{
						label: '他を隠す',
						accelerator: 'Command+Alt+H',
						role: 'hideothers'
					},
					{
						label: 'すべてを表示',
						role: 'unhide'
					},
					{type: 'separator'},
					{
						label: `${app.getName()}を終了`,
						accelerator: 'Command+Q',
						click: () => app.quit()
					}
				]
			},
			//-------------------------------------------------------
			// For Debugging
			// {
			// 	label: '表示',
			// 	submenu: [
			// 		{ role: 'reload' },
			// 		{ role: 'toggleDevTools' },
			// 		{
			// 			label: 'Toggle Window Reseizeable',
			// 			click(){
			// 				mainWindow.setResizable(!mainWindow.isResizable())
			// 			}
			// 		}
			// 	],
			// },
			//-------------------------------------------------------
			{
				label: 'ウィンドウ',
				role: 'window',
				submenu: [
					{
						label: '最小化',
						accelerator: 'Cmd+M',
						role: 'minimize'
					},
					{
						label: '閉じる',
						accelerator: 'Cmd+W',
						role: 'close'
					},
					{
						type: 'separator'
					},
					{
						label: 'すべてを手前に表示',
						role: 'front'
					}
				]
			}
		]
	}
	else {
		return [
			{
				label: 'ファイル(&F)',
				submenu: [
					{
						label: '終了',
						role: 'quit'
					}
				]
			},
			//-------------------------------------------------------
			// For Debugging
			// {
			// 	label: '表示',
			// 	submenu: [
			// 		{ role: 'reload' },
			// 		{ role: 'toggleDevTools' },
			// 		{
			// 			label: 'Toggle Window Reseizeable',
			// 			click(){
			// 				mainWindow.setResizable(!mainWindow.isResizable())
			// 			}
			// 		}
			// 	],
			// },
			//-------------------------------------------------------
			{
				label: 'ヘルプ(&H)',
				submenu: [
					{
						label: `${app.getName()}について(&A)`,
						click(){ about(mainWindow) }
					}
				]
			}
		]
	}
})()

let mainWindow = null
let resultWindow = {
	'Google画像検索': {
		src: null,
		tr: null
	},
	'Pinterest': {
		src: null,
		tr: null
	},
	'Tumblr': {
		src: null,
		tr: null
	}
}

const menu = Menu.buildFromTemplate(template)


app.on('ready', () => {
	if (process.platform === 'darwin') {
		Menu.setApplicationMenu(menu)
	}
	createWindow()
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow()
	}
})

ipc.on('get-defaults', (event) => {
	event.sender.send(
		'res-defaults',
		settings.get('langs'),
		settings.get('shows')
	)
})

ipc.on('query', (event, str, lang, shows) => {
	settings.set('langs', lang)
	settings.set('shows', shows)

	if (lang.to === "none") {
		for (let key in shows) {
			if (shows[key] === true) {
				setResultWindow(key, 'src', str)
			}
			else {
				closeResultWindow(key, 'src')
			}
		}
	}
	else {
		translate(str, {from: lang.from, to: lang.to}).then(res => {
			for (let key in shows) {
				if (shows[key] === true) {
					setResultWindow(key, 'src', str)
					setResultWindow(key, 'tr', res.text)
				}
				else {
					closeResultWindow(key, 'src')
					closeResultWindow(key, 'tr')
				}
			}
		}).catch(err => {
			console.error(err)
		})
	}
})

ipc.on('close-result-windows', (event) => {
	closeAllResultWindow()
})

function createWindow () {
	let bounds = settings.get('bounds.mainWindow')

	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1042,
		height: 515,
		useContentSize: true,
		x: bounds.x,
		y: bounds.y,
		show: false,
		resizable: false,
		maximizable: false
	})

	mainWindow.once('ready-to-show', () => {
		mainWindow.show()
	})

	// and load the index.html of the app.
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}))

	if (process.platform !== 'darwin') {
		mainWindow.setMenu(menu)
	}

	mainWindow.on('move', () => {
		if (mainWindow.isMinimized() === false) {
			settings.set('bounds.mainWindow', mainWindow.getBounds())
		}
	})

	mainWindow.on('close', () => {
		closeAllResultWindow()
	})
	// Emitted when the window is closed.
	mainWindow.on('closed', () => {
		mainWindow = null
	})
}

function setResultWindow(target, type, str) {
	let win = resultWindow[target][type]

	if (win === null) {
		createResultWindow(target, type, str)
	}
	else {
		setResultWindowPage(target, type, str)
		win.webContents.on('did-finish-load', () => {
			setResultWindowTitle(win, target, str)
		})
	}
}

function createResultWindow(target, type, str) {
	let bounds = settings.get(`bounds.${target}.${type}`)

	resultWindow[target][type] = new BrowserWindow({
		width: bounds.width,
		height: bounds.height,
		x:bounds.x,
		y: bounds.y,
		show: false
	})

	let win = resultWindow[target][type]

	win.once('ready-to-show', () => {
		win.show()
		setResultWindowTitle(win, target, str)
	})

	setResultWindowPage(target, type, str)

	win.on('move', () => {
		saveResultWindowBounds(target, type)
	})

	win.on('resize', () => {
		saveResultWindowBounds(target, type)
	})

	win.on('closed', () => {
		resultWindow[target][type] = null
	})
}

function setResultWindowPage(target, type, str) {
	let win = resultWindow[target][type]

	win.loadURL(getUrl(target, str))
}

function setResultWindowTitle(win, target, str) {
	win.setTitle(`${str} | ${target}`)

}

function closeAllResultWindow() {
	for (let key in resultWindow) {
		closeResultWindow(key, 'src')
		closeResultWindow(key, 'tr')
	}
}

function closeResultWindow(target, type) {
	let win = resultWindow[target][type]

	if (win !== null) {
		win.close()
	}
}

function getUrl(target, str) {
	return base_url[target].replace('%q', str)
}

function saveResultWindowBounds(target, type) {
	let win = resultWindow[target][type]

	if (
		win.isMinimized() === false &&
		win.isMaximized() === false
	) {
		settings.set(`bounds.${target}.${type}`, win.getBounds())
	}
}
