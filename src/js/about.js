'use strict';
const {shell} = require('electron')

let links = link.children

for (let i = 0; i < links.length; i++) {
	if (links[i].tagName === 'A') {
		links[i].onclick = event => {
			let url = links[i].getAttribute('href')
			shell.openExternal(url)

			return false
		}
	}
}
