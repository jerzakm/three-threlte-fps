<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { rendererStores } from '$lib/renderer/rendererStores';
	import { onDestroy, onMount } from 'svelte';
	import { get } from 'svelte/store';
	import type { PerspectiveCamera } from 'three';

	let debugCamera: PerspectiveCamera | undefined = undefined;
	$: debugCamera ? rendererStores.debugCamera.set(debugCamera) : '';

	const { activeCamera } = rendererStores;

	let previousCamera = get(activeCamera);
	activeCamera.set('debug');

	onDestroy(() => {
		console.log('destroying debug cam', {
			previousCamera
		});
		activeCamera.set('eyes');
	});
</script>

<T.PerspectiveCamera fov={60} near={0.0001} bind:ref={debugCamera} position={[-2, 2.5, -1]}>
	<OrbitControls target={[0, 2, -1]} autoRotate autoRotateSpeed={0.01} />
</T.PerspectiveCamera>
