const stylus = require('stylus')
const fs = require('fs-extra')
const {join, basename, extname} = require('path')
const {dirs} = require('../package.json')

let argv = process.argv
let ext = '.stylus'

if (argv.lengs > 2) {
	// Rendering specified files.
	argv.slice(2).forEach((arg) => {
		if (extname(arg) === ext) {
			stylus2css(dir.stylus, dir.tmp, arg)
		}
	})
}
else{
	// Rendering files under stylus directory.
	fs.readdir(dirs.stylus, (err, files) => {
		files.forEach((fname) => {
			if (extname(fname) === ext) {
				stylus2css(dirs.stylus, dirs.tmp, fname)
			}
		})
	})
}


function stylus2css(src_dir, dist_dir, fname) {
	fs.readFile(join(src_dir, fname), 'utf8', (err, str) => {
		if (err) throw err

		let mixin = join(src_dir, 'mixin')

		stylus(str, {compress: true})
			.set('paths', [mixin])
			.render((err, css) => {
				if (err) throw err

				fs.outputFile(join(
					dist_dir,
					basename(fname, extname(fname)) + '.css'
				), css, (err) => {
					if (err) throw err
				})
			})
	})
}
