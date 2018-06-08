'use strict';
const electron = require('electron')
const ipc = electron.ipcRenderer
const languages = require('google-translate-api/languages')
const MCS = require('./multi-column-select')

const showClass = 'langSelectValuesShow'

let from = null
let to = null

ipc.send('get-defaults')
ipc.on('res-defaults', (event, lang, shows) => {
	setShows(shows)
	setLangSelect(lang)
})

search.onsubmit = event => {
	let str = q.value

	if (str !== '') {
		let lang = {
			'from': fromLang.value,
			'to': toLang.value
		}
		let shows = {
			'Google画像検索': document.getElementById('Google画像検索').checked,
			'Pinterest': document.getElementById('Pinterest').checked,
			'Tumblr': document.getElementById('Tumblr').checked
		}

		ipc.send('query', str, lang, shows)
	}

	event.preventDefault()
}

closeResultWindows.onclick = event => {
	ipc.send('close-result-windows')
}

target.onkeyup = event => {
	let key = event.code
	let target = event.target

	switch (key) {
		case 'Enter':
		case 'Space':
			if (target.tagName.toLowerCase() === 'label') {
				target = target.control
				target.checked = !target.checked
			}
			break
	}
}

function setShows(shows) {
	for (let key in shows) {
		let elem = document.getElementById(key)

		elem.checked = shows[key]
	}
}

function setLangSelect(lang) {
	let numOfClumn = 16
	let index = { from: 0, to: 0 }
	let fromLangs = (() => {
		let values = []
		let i = 0

		for (let key in languages) {
			if (typeof languages[key] !== 'function') {
				if (key === lang.from) {
					index.from = i
				}

				if (key === lang.to) {
					index.to = i
				}

				values[i] = { value: key, text: languages[key] }
				i++
			}
		}

		return values
	})()
	let toLangs = fromLangs.concat()
	toLangs[0] = { value: 'none', text:  '翻訳しない'}

	from = new MCS(fromLangSelect, fromLangs, 'fromLang', {
		default: index.from,
		rows: numOfClumn
	})
	to = new MCS(toLangSelect, toLangs, 'toLang', {
		default: index.to,
		rows: numOfClumn
	})

}
