const {BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

let aboutWindow

function showAbutWindow(parentWindow) {
	let bounds = parentWindow.getBounds()

	aboutWindow = new BrowserWindow({
		width: 280,
		height: 240,
		useContentSize: true,
		x: bounds.x,
		y: bounds.y,
		parent: (() => {
			if (process.platform === 'darwin') {
				return null
			}
			else {
				return parentWindow
			}
		})(),
		modal: true,
		show: false,
		resizable: false,
		maximizable: false
	})

	aboutWindow.once('ready-to-show', () => {
		aboutWindow.show()
	})

	// and load the index.html of the app.
	aboutWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'about.html'),
		protocol: 'file:',
		slashes: true
	}))
}

module.exports = showAbutWindow
