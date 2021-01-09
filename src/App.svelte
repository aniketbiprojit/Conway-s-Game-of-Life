<script lang="ts">
	export let num
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
	}
</style>

<main>
	<span class="alive" />
	<div class="grid">
		{#each Array(num) as _, i}
			{#each Array(num) as _, j}
				<div class={'cell'} id={(i * num + j).toString()} data-x={i} data-y={j}>
					<p>{i + ',' + j}</p>
				</div>
			{/each}
		{/each}
	</div>
</main>
