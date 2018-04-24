const {exec} = require('child_process')
const tmp = require('./package.json').directories.tmp

exec('npm i', {
	cwd: tmp
}, (err, stdout, stderr) => {
	if (err) {
		console.error(err)
		return
	}
	console.log(stdout)
})
