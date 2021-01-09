import App from './App.svelte'

const app = new App({
	target: document.body,
	props: {
		num: 10,
	},
})

class Cell {
	constructor() {}
}

// new Cell(document.getElementsByClassName('cell')[0])
export default app
