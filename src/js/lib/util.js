function $(str) {
	if (typeof str !== 'string') throw 'Error: string'

	let first = str.substr(0, 1)
	if (first === '#') {
		return document.getElementById(str)
	}
	else if (first === '.') {
		return document.getElementsByClassName(str)
	}
	else {
		return document.getElementsByTagName(str)
	}
}

module.exports = $
