<script lang="ts">
	import { useRender, useThrelte } from '@threlte/core';
	import { onMount } from 'svelte';
	import { rendererStores } from './rendererStores';
	import { requestPointerLockWithUnadjustedMovement } from '$lib/util/pointerLock';

	let pointerLocked = false;
	const { activeCamera, eyesCamera, debugCamera, sightsCamera } = rendererStores;
	const { renderer } = useThrelte();
	renderer?.domElement.addEventListener('click', async () => {
		if (!pointerLocked) {
			requestPointerLockWithUnadjustedMovement(renderer?.domElement);
		}
		// const y = renderer?.domElement.requestPointerLock();
	});

	document.addEventListener(
		'pointerlockchange',
		(e) => {
			pointerLocked = !pointerLocked;
		},
		false
	);

	onMount(() => {
		activeCamera.set('sights');
	});

	useRender(({ scene, renderer }) => {
		//

		// if ($activeCamera == 'eyes' && $eyesCamera) {
		// 	renderer?.render(scene, $eyesCamera);
		// }

		if ($activeCamera == 'eyes' && $sightsCamera) {
			renderer?.render(scene, $sightsCamera);
		}

		if ($activeCamera == 'sights' && $sightsCamera) {
			renderer?.render(scene, $sightsCamera);
		}
		if ($activeCamera == 'debug' && $debugCamera) {
			renderer?.render(scene, $debugCamera);
		}
	});
</script>
