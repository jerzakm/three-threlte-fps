<script lang="ts">
	import App from '$lib/App.svelte';
	import { onMount } from 'svelte';

	let started = false;

	onMount(() => {
		started = true;
	});
</script>

<div>
	{#if started}
		<App />
	{/if}
</div>

<style>
	:global(body) {
		margin: 0;
	}

	div {
		width: 100vw;
		height: 100vh;
		background: rgb(13, 19, 32);
		background: linear-gradient(180deg, rgb(16, 90, 250) 0%, rrgb(9, 39, 109) 100%);
	}
</style>
