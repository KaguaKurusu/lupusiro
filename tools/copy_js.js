const fs = require('fs-extra')
const {dirs} = require('../package.json')

fs.mkdirp(dirs.tmp)
fs.copy(dirs.js, dirs.tmp, { preserveTimestamps: true }, (err) => {
	if (err) throw err
})
