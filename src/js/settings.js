'use strict';
const Settings = require('./electron-settings-wrap')

module.exports = new Settings({
	bounds: {
		mainWindow: {
			x: null,
			y: null
		},
		'Google画像検索': {
			src: {
				width: 800,
				height: 600,
				x: 0,
				y: 0
			},
			tr: {
				width: 800,
				height: 600,
				x: 800,
				y: 0
			}
		},
		'Pinterest': {
			src: {
				width: 800,
				height: 600,
				x: 10,
				y: 50
			},
			tr: {
				width: 800,
				height: 600,
				x: 810,
				y: 50
			}
		},
		'Tumblr': {
			src: {
				width: 800,
				height: 600,
				x: 20,
				y: 100
			},
			tr: {
				width: 800,
				height: 600,
				x: 820,
				y: 100
			}
		}
	},
	shows: {
		'Google画像検索': true,
		'Pinterest': true,
		'Tumblr': true
	},
	langs: {
		from: 'ja',
		to: 'en'
	}
})
