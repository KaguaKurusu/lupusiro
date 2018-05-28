const electron = require('electron')
const ipc = electron.ipcRenderer
const languages = require('google-translate-api/languages')

let langs = {}

for (let key in languages) {
	if (typeof languages[key] !== 'function') {
		langs[key] = languages[key]
	}
}

ipc.send('get-defaults')
ipc.on('res-defaults', (event, lang, shows) => {
	setShows(shows)
	setLangSelect(lang)
})

search.onsubmit = (event) => {
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

	return false
}

closeResultWindows.onclick = (event) => {
	ipc.send('close-result-windows')
}

body.onclick = event => {
	let target = event.target
	let tid = target.id
	let cn = target.className

	if (cn === 'toLangSelectValue') {
		t.innerText = target.innerText
		toLang.value = target.dataset.value
		toLangSelectValues.classList.remove('langSelectValuesShow')
	}
	else if (tid === 't') {
		toLangSelectValues.classList.toggle('langSelectValuesShow')
	}
	else {
		toLangSelectValues.classList.remove('langSelectValuesShow')
	}

	if (cn === 'fromLangSelectValue') {
		f.innerText = target.innerText
		fromLang.value = target.dataset.value
		fromLangSelectValues.classList.remove('langSelectValuesShow')
	}
	else if (tid === 'f') {
		fromLangSelectValues.classList.toggle('langSelectValuesShow')
	}
	else {
		fromLangSelectValues.classList.remove('langSelectValuesShow')
	}
}


function setShows(shows) {
	for (let key in shows) {
		let elem = document.getElementById(key)

		elem.checked = shows[key]
	}
}

function setLangSelect(lang) {
	let i = 0
	let ul_f = document.createElement('ul')
	let ul_t = document.createElement('ul')


	for (let key in langs) {
		let li_f = document.createElement('li')
		let li_t = document.createElement('li')

		li_f.dataset.value = key
		li_f.innerText = langs[key]
		li_f.className = 'fromLangSelectValue'
		ul_f.appendChild(li_f)

		console.log(`${lang.from}: ${key}: ${lang.from === key}`)
		if (lang.from === key) {
			fromLang.value = key
			f.innerText = langs[key]
		}

		let str = langs[key]
		if (key === 'auto') {
			key = 'none'
			str = '翻訳しない'
		}

		li_t.dataset.value = key
		li_t.innerText = str
		li_t.className = 'toLangSelectValue'
		ul_t.appendChild(li_t)

		console.log(`${lang.to}: ${key}: ${lang.to === key}`)
		if (lang.to === key) {
			toLang.value = key
			t.innerText = str
		}

		i = (i + 1) % 16

		if (i === 0) {
			fromLangSelectValues.appendChild(ul_f)
			toLangSelectValues.appendChild(ul_t)

			ul_t = document.createElement('ul')
			ul_f = document.createElement('ul')
		}
	}

	fromLangSelectValues.appendChild(ul_f)
	toLangSelectValues.appendChild(ul_t)
}
