'use strict';
const {app, Menu} = require('electron')
const about = require('./about')

class menu {
	constructor(win, isDebug) {
		this.win = win
		this.isDebug = isDebug

		let template = []

		if (process.platform === 'darwin') {
			template = [
				{
					label: app.getName(),
					submenu: [
						{
							label: `${app.getName()}について`,
							click(){ about(win) }
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
							accelerator: 'Cmd+H',
							click(){ app.hide() }
						},
						{
							label: '他を隠す',
							accelerator: 'Cmd+Alt+H',
							role: 'hideothers'
						},
						{
							label: 'すべてを表示',
							role: 'unhide'
						},
						{type: 'separator'},
						{
							label: `${app.getName()}を終了`,
							accelerator: 'Cmd+Q',
							click(){ app.quit() }
						}
					]
				},
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
			template =  [
				{
					label: 'ファイル(&F)',
					submenu: [
						{
							label: '終了',
							accelerator: 'CmdOrCtrl+Q',
							role: 'quit'
						}
					]
				},
				{
					label: 'ヘルプ(&H)',
					submenu: [
						{
							label: `${app.getName()}について(&A)`,
							click(){ about(win) }
						}
					]
				}
			]
		}

		if (isDebug) {
			template[2] = template[1]
			template[1] = {
				label: '表示',
				submenu: [
					{ role: 'reload' },
					{ role: 'toggleDevTools' },
					{
						label: 'Toggle Window Reseizeable',
						click(){
							win.setResizable(!win.isResizable())
						}
					}
				],
			}
		}

		this.menu = Menu.buildFromTemplate(template)
	}

	setAppMenu() {
		Menu.setApplicationMenu(this.menu)
	}

	setMenu() {
		this.win.setMenu(this.menu)
	}
}

module.exports = menu
