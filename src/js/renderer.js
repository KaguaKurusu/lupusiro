const electron = require('electron')
const ipc = electron.ipcRenderer
const languages = require('google-translate-api/languages')

let langs = {}

for (let key in languages) {
	if (typeof languages[key] !== 'function') {
		langs[key] = languages[key]
	}
}

delete langs.auto

ipc.send('get-defaults')
ipc.on('res-defaults', (event, lang, shows) => {
	// let elem = document.getElementsByName('shows')
	setShows(shows)
	setLangSelect(lang)
})

document.onselectstart = (event) => {
	return event.target.parentElement.classList.contains('enable-select')
}

search.onsubmit = submit.onclick = (event) => {
	let str = q.value

	if (str !== '') {
		let lang = {
			'from': f.value,
			'to': t.value
		}
		let shows = {
			'Google画像検索': document.getElementById('Google画像検索').checked,
			'Pinterest': document.getElementById('Pinterest').checked,
			'Tumblr': document.getElementById('Tumblr').checked
		}

		ipc.send('query', str, lang, shows)
	}

	return false
}

closeResultWindows.onclick = (event) => {
	ipc.send('close-result-windows')
}

function setShows(shows) {
	for (let key in shows) {
		let elem = document.getElementById(key)

		elem.checked = shows[key]
	}
}

function setLangSelect(lang) {
	for (let key in langs) {
		let opt_f = document.createElement('option')
		let opt_t = document.createElement('option')

		opt_f.value = key
		opt_f.text = langs[key]

		if (lang.from === key) {
			opt_f.selected = true
		}

		opt_t.value = key
		opt_t.text = langs[key]

		if (lang.to === key) {
			opt_t.selected = true
		}

		f.add(opt_f)
		t.add(opt_t)
	}
}
