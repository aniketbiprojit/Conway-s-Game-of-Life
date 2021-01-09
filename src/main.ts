import App from './App.svelte'

const num = 10

const size = 40 //pixels

const app = new App({
	target: document.body,
	props: {
		num: num,
	},
})

const grid: Array<Array<Cell>> = Array.from(Array(10), () => new Array(10))

class Cell {
	block: HTMLElement
	alive: boolean = false
	constructor(block: HTMLElement) {
		this.block = block
		grid[parseInt(block.dataset.x)][parseInt(block.dataset.y)] = this
		if (Math.random() < 0.1) {
			block.classList.add('alive')
			this.alive = true
		}
	}

	kill() {
		this.alive = false
		this.block.classList.remove('alive')
	}

	raise() {
		this.alive = true
		this.block.classList.add('alive')
	}

	neighbours: number = 0

	setInner(text: string) {
		this.block.children[0].innerHTML = text
	}
}

const cells = document.getElementsByClassName('cell')

Array.from(cells).forEach((element) => {
	if (element instanceof HTMLElement) {
		new Cell(element)
	}
})

function update() {
	for (let i = 0; i < num; i++) {
		for (let j = 0; j < num; j++) {
			const cell = grid[i][j]
			const neighbours = countNeighbours(i, j)
			cell.neighbours = neighbours
			cell.setInner(neighbours.toString())
		}
	}
	for (let i = 0; i < num; i++) {
		for (let j = 0; j < num; j++) {
			grid[i][j].setInner(countNeighbours(i, j).toString())
		}
	}
}

function countNeighbours(i: number, j: number) {
	let count = 0
	for (let x_off = -1; x_off <= 1; x_off++) {
		for (let y_off = -1; y_off <= 1; y_off++) {
			const x = (i + x_off) % num
			const y = (j + y_off + num) % num
			if (x == -1) {
				continue
			}
			console.log(x, y)
			if (grid[x][y].alive) {
				count++
			}
		}
	}
	if (grid[i][j].alive) {
		count--
	}
	return count
}

update()

export default app
