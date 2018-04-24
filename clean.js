const fs = require('fs-extra')
const dirs = require('./package.json').directories

fs.remove(dirs.tmp, (err) => { if (err) throw err})
fs.remove(dirs.dist, (err) => { if (err) throw err})
// fs.remove('node_modules', (err) => { if (err) throw err})
