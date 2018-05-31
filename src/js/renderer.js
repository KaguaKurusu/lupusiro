const electron = require('electron')
const ipc = electron.ipcRenderer
const languages = require('google-translate-api/languages')

const showClass = 'langSelectValuesShow'

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

	return false
}

closeResultWindows.onclick = event => {
	ipc.send('close-result-windows')
}

window.onkeyup = event => {
	let key = event.code
	let target = event.target
	let id = target.id
	let fromClass = fromLangSelectValues.classList
	let toClass = toLangSelectValues.classList

	switch (key) {
		case 'Enter':
		case 'Space':
			if (id === 'f') {
				if (fromClass.contains(showClass)) {
					// TODO: 言語選択完了させる処理追加
					fromClass.remove(showClass)
				}
				else {
					toClass.remove(showClass)
					fromClass.add(showClass)
				}
			}
			else if (id === 't') {
				if (toClass.contains(showClass)) {
					// TODO: 言語選択完了させる処理追加
					toClass.remove(showClass)
				}
				else {
					fromClass.remove(showClass)
					toClass.add(showClass)
				}
			}
			else if (target.tagName === 'LABEL') {
				target = target.control
				target.checked = !target.checked
			}
			break
	}
}

body.onclick = event => {
	let target = event.target
	let tid = target.id
	let cn = target.className

	if (cn === 'toLangSelectValue') {
		t.innerText = target.innerText
		toLang.value = target.dataset.value
		toLangSelectValues.classList.remove(showClass)
	}
	else if (tid === 't') {
		toLangSelectValues.classList.toggle(showClass)
	}
	else {
		toLangSelectValues.classList.remove(showClass)
	}

	if (cn === 'fromLangSelectValue') {
		f.innerText = target.innerText
		fromLang.value = target.dataset.value
		fromLangSelectValues.classList.remove(showClass)
	}
	else if (tid === 'f') {
		fromLangSelectValues.classList.toggle(showClass)
	}
	else {
		fromLangSelectValues.classList.remove(showClass)
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
