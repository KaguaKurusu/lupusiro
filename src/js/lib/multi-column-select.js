'use strict';
class MultiColumnSelect {
	constructor(elem, values, id, opts) {
		this.root = elem
		this.values = values
		this.id = id
		this.valuesElem = []
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
		this.input.id = id

		this.set()
		this.create()

		this.root.appendChild(this.button)
		this.root.appendChild(this.select)
		this.root.appendChild(this.input)

		this.valuesElem[this.selected].classList.add('selected')

		this.button.onmousedown = event => {
			if (this.isHide()) {
				this.past_selected = this.selected
			}
			else {
				this.changeSelected(this.selected, this.past_selected)
			}
			this.toggle()
		}

		this.select.onmousedown = event => {
			if (this.isShow()) {
				this.selected = event.target.dataset.index
				this.set()
				this.hide()
			}
		}

		this.button.onblur = event => {
			if (this.isShow()) {
				this.changeSelected(this.selected, this.past_selected)
				this.hide()
			}
		}

		this.button.onkeydown = event => {
			switch (event.code) {
				case 'Enter':
				case 'Space':
					if (this.isHide()) {
						this.past_selected = this.selected
					}
					else {
						this.set()
					}
					this.toggle()
					break
				case 'ArrowUp':
					if(this.isShow()) {
						let oldIdx = this.selected
						let newIdx = oldIdx - 1
						let maxIdx = this.values.length - 1

						if (newIdx < 0) {
							newIdx = maxIdx
						}

						this.changeSelected(oldIdx, newIdx)
					}
					break
				case 'ArrowDown':
					if(this.isShow()) {
						let oldIdx = this.selected
						let newIdx = oldIdx + 1
						let maxIdx = this.values.length - 1

						if (newIdx > maxIdx) {
							newIdx = 0
						}

						this.changeSelected(oldIdx, newIdx)
					}
					break
				case 'ArrowRight':
					if(this.isShow()) {
						let oldIdx = this.selected
						let newIdx = oldIdx + this.rows
						let maxIdx = this.values.length - 1

						if (newIdx > maxIdx) {
							newIdx = oldIdx - parseInt(maxIdx / this.rows) * this.rows

							if (newIdx < 0) {
								newIdx += this.rows
							}
						}


						this.changeSelected(oldIdx, newIdx)
					}
					break
				case 'ArrowLeft':
					if(this.isShow()) {
						let oldIdx = this.selected
						let newIdx = oldIdx - this.rows
						let maxIdx = this.values.length - 1

						if (newIdx < 0) {
							newIdx = oldIdx + parseInt(maxIdx / this.rows) * this.rows

							if (newIdx > maxIdx) {
								newIdx -= this.rows
							}
						}

						this.changeSelected(oldIdx, newIdx)
					}
					break
				case 'Escape':
					this.changeSelected(this.selected, this.past_selected)
					this.hide()
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
				li.onmouseover = event => {
					let target = event.target
					this.changeSelected(this.selected, parseInt(target.dataset.index))
				}
				ul.appendChild(li)
				this.valuesElem.push(li)

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
		if (this.isHide()) {
			this.select.classList.add('mcs-show')
		}
	}

	hide() {
		if (this.isShow()) {
			this.select.classList.remove('mcs-show')
		}
	}

	isShow() {
		return this.select.classList.contains('mcs-show')
	}

	isHide() {
		return !this.select.classList.contains('mcs-show')
	}

	toggle() {
		this.select.classList.toggle('mcs-show')
	}

	set() {
		this.input.value = this.values[this.selected].value
		this.button.innerText = this.values[this.selected].text
	}

	changeSelected(oldIdx, newIdx) {
		this.valuesElem[oldIdx].classList.remove('selected')
		this.valuesElem[newIdx].classList.add('selected')
		this.selected = newIdx
	}
}

module.exports = MultiColumnSelect
