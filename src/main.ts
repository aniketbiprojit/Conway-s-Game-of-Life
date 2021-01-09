import App from './App.svelte'

const num = 10

const size = 40 //pixels

const app = new App({
	target: document.body,
	props: {
		num: num,
	},
})

const grid: Array<Array<Cell>> = Array.from(Array(num), () => new Array(num))

class Cell {
	block: HTMLElement
	alive: boolean = false
	constructor(block: HTMLElement) {
		this.block = block
		grid[parseInt(block.dataset.x)][parseInt(block.dataset.y)] = this
		if (Math.random() < 0.2) {
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
	let total_count = 0
	for (let i = 0; i < num; i++) {
		for (let j = 0; j < num; j++) {
			const cell = grid[i][j]
			const neighbours = countNeighbours(i, j)
			total_count += neighbours
			cell.neighbours = neighbours
			cell.setInner(neighbours.toString())
		}
	}

	const copy_of_grid = Object.assign({}, grid)

	if (total_count === 0) {
		for (let i = 0; i < num; i++) {
			for (let j = 0; j < num; j++) {
				const cell = grid[i][j]

				if (Math.random() < 0.2) cell.raise()
			}
		}
	} else {
		for (let i = 0; i < num; i++) {
			for (let j = 0; j < num; j++) {
				const cell = copy_of_grid[i][j]
				if (cell.alive) {
					if (cell.neighbours < 2 || cell.neighbours > 3) {
						cell.kill()
					}
				} else {
					if (cell.neighbours === 3) {
						cell.raise()
					}
				}
			}
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

setInterval(update, 100)

export default app
