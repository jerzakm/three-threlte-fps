<script lang="ts">
	import { playerStores } from '$lib/player/playerStores';
	import { T } from '@threlte/core';
	import { AudioListener } from '@threlte/extras';
	import type { PerspectiveCamera } from 'three';
	import { rendererStores } from './rendererStores';

	let eyesCamera: PerspectiveCamera | undefined = undefined;
	let sightsCamera: PerspectiveCamera | undefined = undefined;
	let debugCamera: PerspectiveCamera | undefined = undefined;

	$: eyesCamera ? rendererStores.eyesCamera.set(eyesCamera) : '';
	$: sightsCamera ? rendererStores.sightsCamera.set(sightsCamera) : '';
	$: debugCamera ? rendererStores.debugCamera.set(debugCamera) : '';
</script>

<T.PerspectiveCamera fov={60} near={0.0001} bind:ref={eyesCamera}>
	<AudioListener />
</T.PerspectiveCamera>

<T.PerspectiveCamera fov={60} near={0.0001} bind:ref={sightsCamera} />
<T.PerspectiveCamera fov={60} near={0.0001} bind:ref={debugCamera} />
