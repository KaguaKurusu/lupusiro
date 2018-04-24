const pug = require('pug')
const fs = require('fs-extra')
const join = require('path').join
const basename = require('path').basename
const extname = require('path').extname
const dirs = require('./package.json').directories
const app_name = require('./package.json').name
const app_ver = require('./package.json').version
const author = require('./package.json').author

let argv = process.argv
let ext = '.pug'

if (argv.length > 2) {
	// Rendering specified files.
	argv.splice(2).forEach((arg) => {
		if (extname(arg) === ext) {
			pug2html(dirs.pug, dirs.tmp, arg)
		}
	})
}
else {
	// Rendering files under pug directory.
	fs.readdir(dirs.pug, (err, files) => {
		files.forEach((fname) => {
			if (extname(fname) === ext) {
				pug2html(dirs.pug, dirs.tmp, fname)
			}
		})
	})
}

function pug2html(src_dir, dest_dir, fname) {
	var html = pug.compileFile(join(src_dir, fname), {
		basedir: src_dir,
		// Format style. If you don't want minify then uncomment next line.
		// pretty: '\t',
	})({
		// variable in Pug
		'app_name': app_name,
		'app_ver': app_ver,
		'author': author
	})

	fs.outputFile(join(
		dest_dir,
		basename(fname, extname(fname)) + '.html'
	), html, (err) => {
		if (err) throw err
	})
}
