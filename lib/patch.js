const DiffMatchPatch = require('diff-match-patch')

module.exports = function patchApplay(data) {
	return new Promise((resolve, reject) => {
		let dmp = new DiffMatchPatch()
		let src_text = data[0].toString()
		let patch_text = data[1].toString()
		let patch = dmp.patch_fromText(patch_text)
		let result = dmp.patch_apply(patch, src_text)
		resolve(result[0])
	})
}
