class MultiColumnSelect {
	constructor(elem, values, opts) {
		this.root = elem
		this.values = values
		this.rows = opts.rows || 16
		this.selected = opts.default || 0

		this.button = document.createElement('div')
		this.select = document.createElement('div')
		this.input = document.createElement('input')

		this.button.className = 'mcs-button'
		this.select.className = 'mcs-select'
		this.input.className = 'mcs-input'

		this.button.setAttribute('tabindex', '0')
		this.input.type = 'hidden'

		this.set()
		this.create()

		this.root.appendChild(this.button)
		this.root.appendChild(this.select)
		this.root.appendChild(this.input)

		this.button.onmousedown = event => {
			this.toggle()
		}

		this.select.onmousedown = event => {
			console.log(event.target)
			this.selected = event.target.dataset.index
			this.set()
			this.hide()
		}

		this.button.onblur = event => {
			this.hide()
		}

		this.button.onkeyup = event => {
			switch (event.code) {
				case 'Enter':
				case 'Space':
					this.toggle()
					this.set()
					break

				case 'ArrowUp':
					break
				case 'ArrowDown':
					break
				case 'ArrowRight':
					break
				case 'ArrowLeft':
					break
			}
		}

	}

	create() {
		let ul = document.createElement('ul')
		let i = 0
		let col = 0

		for (let value of this.values) {
				let li = document.createElement('li')

				li.dataset.value = value.value
				li.dataset.index = i + col * this.rows
				li.innerText = value.text
				li.className = 'mcs-value'
				ul.appendChild(li)

				i = (i + 1) % this.rows

				if (i === 0) {
					this.select.appendChild(ul)
					ul = document.createElement('ul')
					col++
				}
		}

		if (i !== 0) {
			this.select.appendChild(ul)
		}
	}

	show() {
		if (!this.select.classList.contains('mcs-show')) {
			this.select.classList.add('mcs-show')
		}
	}

	hide() {
		if (this.select.classList.contains('mcs-show')) {
			this.select.classList.remove('mcs-show')
		}
	}

	toggle() {
		this.select.classList.toggle('mcs-show')
	}

	set() {
		this.input.value = this.values[this.selected].value
		this.button.innerText = this.values[this.selected].text
	}
}

module.exports = MultiColumnSelect
