import App from './App.svelte'

const num = 10

const size = 40 //pixels

var cycles = 0

const app = new App({
	target: document.body,
	props: {
		num,
		update,
		start,
		stop,
		resetCells,
		handleCellClick,
		clear,
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
	cycles += 1
	// console.log(cycles)
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
		cycles = 0
		// resetCells()
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

function clear() {
	stop()
	for (let i = 0; i < num; i++) {
		for (let j = 0; j < num; j++) {
			const cell = grid[i][j]
			if (cell.alive) {
				cell.kill()
			}
		}
	}
	updateNeighbours()
}

function handleCellClick(e) {
	stop()
	let { x, y } = e.target.dataset
	x = parseInt(x)
	y = parseInt(y)
	const cell = grid[x][y]
	if (cell.alive) {
		cell.kill()
	} else {
		cell.raise()
	}
	updateNeighbours()
}

function updateNeighbours() {
	for (let i = 0; i < num; i++) {
		for (let j = 0; j < num; j++) {
			const cell = grid[i][j]
			const neighbours = countNeighbours(i, j)
			cell.neighbours = neighbours
			cell.setInner(neighbours.toString())
		}
	}
}

function resetCells(restart: boolean = false) {
	stop()
	for (let i = 0; i < num; i++) {
		for (let j = 0; j < num; j++) {
			const cell = grid[i][j]

			if (Math.random() < 0.2) cell.raise()
		}
	}
	update()
	if (restart) {
		start()
	}
}

function countNeighbours(i: number, j: number) {
	let count = 0
	for (let x_off = -1; x_off <= 1; x_off++) {
		for (let y_off = -1; y_off <= 1; y_off++) {
			const x = (i + x_off + num) % num
			const y = (j + y_off + num) % num
			// console.log(x, y)
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

let interval

function start() {
	if (interval) clearInterval(interval)
	interval = setInterval(update, 100)
}

function stop() {
	if (interval) clearInterval(interval)
}

start()

export default app
