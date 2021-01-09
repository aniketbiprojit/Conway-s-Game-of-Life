<script lang="ts">
	export let num
</script>

<style>
	.grid {
		width: 400px;
		height: 400px;
		background-color: grey;
		display: flex;
		flex-wrap: wrap;
	}
	.cell {
		width: 40px;
		height: 40px;
	}
</style>

<main>
	<div class="grid">
		{#each Array(num) as _, i}
			{#each Array(num) as _, j}
				<div class={'cell'} id={(i * num + j).toString()} data-x={i} data-y={j} />
			{/each}
		{/each}
	</div>
</main>
