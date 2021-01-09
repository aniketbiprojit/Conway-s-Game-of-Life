import App from './App.svelte'

const num = 10
const app = new App({
	target: document.body,
	props: {
		num: num,
	},
})

const grid = Array.from(Array(10), () => new Array(10))

class Cell {
	block: HTMLElement
	constructor(block: HTMLElement) {
		this.block = block
		grid[parseInt(block.dataset.x)][parseInt(block.dataset.y)] = this
		if (Math.random() < 0.5) {
			block.classList.add('alive')
		}
	}
}

const cells = document.getElementsByClassName('cell')
// console.log(cells)
Array.from(cells).forEach((element) => {
	if (element instanceof HTMLElement) {
		new Cell(element)
	}
})
console.log(grid)

export default app
