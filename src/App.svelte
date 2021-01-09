<script lang="ts">
	export let num
	export let update,  start, stop,resetCells
	export let handleCellClick,clear
</script>

<style>
	.grid {
		width: 400px;
		height: 400px;
		background-color: white;
		display: flex;
		flex-wrap: wrap;
	}
	.cell {
		cursor:pointer;
		width: 38px;
		height: 38px;
		border: 1px solid black;
		display: flex;
		text-align: center;
		justify-content: center;
		align-items: center;
	}
	.alive {
		background-color: black;
	}
	p {
		margin: 0;
		pointer-events: none;
	}
</style>

<main>
	<span class="alive" />
	
	<button on:click={()=>clear()}>Clear</button>
	<button on:click={update}>Run Once</button>
	<button on:click={()=>start()}>Start</button>
	<button on:click={()=>stop()}>Stop</button>
	<button on:click={()=>resetCells()}>Reset</button>
	<button on:click={()=>resetCells(true)}>Restart</button>
	<div class="grid">
		{#each Array(num) as _, i}
			{#each Array(num) as _, j}
				<div on:click={handleCellClick} class={'cell'} id={(i * num + j).toString()} data-x={i} data-y={j}>
					<p on:click={e=>{e.preventDefault()}}>{i + ',' + j}</p>
				</div>
			{/each}
		{/each}
	</div>
	<h3>Clear and click the cells to make custom objects.</h3>
	<h4>The cells live in a semi-	wrapped space and not infinite space so gliders will re-enter the plane.</h4>
	<h1>Rules</h1>
	<li>Any live cell with fewer than two live neighbours dies, as if by underpopulation.</li>
	<li>Any live cell with two or three live neighbours lives on to the next generation.</li>
	<li>Any live cell with more than three live neighbours dies, as if by overpopulation.</li>
	<li>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
</main>
