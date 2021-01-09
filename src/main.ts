import App from './App.svelte'

const app = new App({
	target: document.body,
	props: {
		num: 10,
	},
})

class Cell {
	constructor(block: Element) {}
}

const cells = document.getElementsByClassName('cell')
// console.log(cells)
Array.from(cells).forEach((element) => {
	new Cell(element)
	console.log();
})

export default app
