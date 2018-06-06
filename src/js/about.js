const {BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

const width = 280
const height = 240

let aboutWindow = null

function showAbutWindow(parentWindow) {
	let bounds = parentWindow.getBounds()
	let size = parentWindow.getSize()
	let x = bounds.x + parseInt(size[0] / 2) - parseInt(width / 2)
	let y = bounds.y + parseInt(size[1] / 2) - parseInt(height / 2)

	console.log(`x: ${x}, y: ${y}`)

	aboutWindow = new BrowserWindow({
		width: width,
		height: height,
		useContentSize: true,
		x: x,
		y: y,
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
