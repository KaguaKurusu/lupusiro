'use strict';
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain
const path = require('path')
const url = require('url')
const translate = require('google-translate-api')
const settings = require('./settings')
const Menu = require('./menu')

const base_url = {
	'Google画像検索': 'https://www.google.co.jp/search?hl=ja&tbm=isch&q=%q',
	'Pinterest': 'https://www.pinterest.jp/search/pins/?q=%q',
	'Tumblr': 'https://www.tumblr.com/search/%q'
}

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

app.on('ready', () => {
	if (process.platform === 'darwin') {
		// Menu.setApplicationMenu(menu)
		menu.setAppMenu()
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

function createWindow() {
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

	// for Release
	const menu = new Menu(mainWindow, false)

	// for Debug
	// const menu = new Menu(mainWindow, true)

	if (process.platform !== 'darwin') {
		// mainWindow.setMenu(menu)
		menu.setMenu()
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
