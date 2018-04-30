const packager = require("electron-packager")
const package = require("../package.json")
const {join} = require('path')
const electron_ver = require("../node_modules/electron/package.json").version
const os = require('os')

let out_arch = null
let icon_ext = ''

switch (process.argv[2]) {
	case 'x64':
	case 'x86_64':
	case 'amd64':
		out_arch = 'x64'
		break
	case 'ia32':
	case 'x86':
		out_arch = 'ia32'
		break
	default:
		switch (os.arch()) {
			case 'x64':
				out_arch = 'x64'
				break
			case 'x86':
			case 'ia32':
				out_arch = 'ia32'
				break
			default:
				out_arch = null
		}
}

switch (process.platform) {
	case 'win32':
		icon_ext = '.ico'
		break
	case 'darwin':
		icon_ext = '.icns'
		break
}

switch (out_arch) {
	case 'x64':
	case 'ia32':
		packager({
			name: package.name,
			dir: package.dirs.tmp,
			out: package.dirs.dist,
			// icon: `src/app_icon${icon_ext}`,
			ignore: '.git',
			platform: process.platform,
			arch: out_arch,
			electronVersion: electron_ver,
			overwrite: true,
			asar: true,
			appVersion: package.version,
			appCopyright: `Copyright (C) 2018 ${package.author}.`,

			win32metadata: {
				CompanyName: package.author,
				FileDescription: package.name,
				OriginalFilename: `${package.name}.exe`,
				ProductName: package.name,
				InternalName: package.name
			}

		}, function (err, appPaths) {// 完了時のコールバック
			if (err) console.log(err)
			console.log(`Done: ${appPaths}`)
		})
		break
}
