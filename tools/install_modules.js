const {exec} = require('child_process')
const {join} = require('path')
const tmp = require('../package.json').dirs.tmp

exec('npm i', {
	cwd: tmp
}, (err, stdout, stderr) => {
	if (err) {
		console.error(err)
		return
	}
	console.log(stdout)
})
