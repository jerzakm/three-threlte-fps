<script lang="ts">
	import { controlStores } from '$lib/controls/controlStores';
	import { onDestroy } from 'svelte';

	export let allowPointerLock: boolean;
	export let allowMouseAim: boolean;

	$: controlStores.allowPointerLock.set(allowPointerLock);
	$: controlStores.allowMouseAim.set(allowMouseAim);

	onDestroy(() => {
		controlStores.allowPointerLock.set(true);
		controlStores.allowMouseAim.set(true);
	});
</script>
