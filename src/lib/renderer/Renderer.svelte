<script lang="ts">
	import { useRender } from '@threlte/core';
	import { onMount } from 'svelte';
	import { rendererStores } from './rendererStores';

	const { activeCamera, eyesCamera, debugCamera, sightsCamera } = rendererStores;

	onMount(() => {
		activeCamera.set('sights');
	});

	useRender(({ scene, renderer }) => {
		//

		if ($activeCamera == 'eyes' && $eyesCamera) {
			renderer?.render(scene, $eyesCamera);
		}

		if ($activeCamera == 'sights' && $sightsCamera) {
			renderer?.render(scene, $sightsCamera);
		}
		if ($activeCamera == 'debug' && $debugCamera) {
			renderer?.render(scene, $debugCamera);
		}
	});
</script>
