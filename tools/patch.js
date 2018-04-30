const DiffMatchPatch = require('diff-match-patch')
const fs = require('fs')
const {join} = require('path')
const tmp = require('../package.json').dirs.tmp

let dmp = new DiffMatchPatch()
let src_path = 'node_modules/google-translate-api/languages.js'
let rw_opt = {encoding: 'UTF-8'}

fs.readFile('languages.patch', rw_opt, (err, patchText) => {
	if (err) throw err

	let patch = dmp.patch_fromText(patchText)

	fs.readFile(src_path, rw_opt, (err, srcText) => {
		if (err) throw err

		let result = dmp.patch_apply(patch, srcText)
		fs.writeFile(join(tmp, src_path), result[0], rw_opt, (err) => {
			if (err) throw err
		})
	})
})
