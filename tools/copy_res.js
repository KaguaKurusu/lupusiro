const fs = require('fs-extra')
const {join} = require('path')
const pkg = require('../package.json')
const dirs = pkg.dirs

pkg.devDependencies = undefined
pkg.scripts.start = 'node main.js'

fs.outputJson(
	join(dirs.tmp, 'package.json'),
	pkg,
	{ spaces: 2 },
	(err) => { if (err) throw err }
)

fs.copy(dirs.img, dirs.tmp, (err) => {
	if (err) throw err
})
