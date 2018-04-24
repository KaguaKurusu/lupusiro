const fs = require('fs')
const path = require('path')

const src_dir = 'src'
const dest_dir = 'tmp'

fs.watch(
	src_dir,
	{
		recursive: true
	},
	(eventType, filename) => {
	console.log(`event type is: ${eventType}`)
	if (filename) {
		console.log(`filename provided: ${filename}`)
		// switch (eventType) {
		// 	case 'change':
		// 	fs.copyFile(
		// 		path.join(src_dir, filename),
		// 		path.join(dest_dir, filename),
		// 		(err) => { if (err) throw err }
		// 	)
		// 	break;
		// 	case 'rename':
		// 	default:
		// }
	}
})
