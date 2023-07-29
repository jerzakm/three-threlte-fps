<script lang="ts">
	import { T, useFrame } from '@threlte/core';
	import { AudioListener } from '@threlte/extras';
	import { Vector3, type PerspectiveCamera, Quaternion, CameraHelper } from 'three';
	import { rendererStores } from './rendererStores';
	import { cameraStores } from './cameraStores';
	import { quadInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import { playerStores } from '$lib/player/playerStores';

	let eyesCamera: PerspectiveCamera | undefined = undefined;
	let sightsCamera: PerspectiveCamera | undefined = undefined;
	let debugCamera: PerspectiveCamera | undefined = undefined;

	$: eyesCamera ? rendererStores.eyesCamera.set(eyesCamera) : '';
	$: sightsCamera ? rendererStores.sightsCamera.set(sightsCamera) : '';
	$: debugCamera ? rendererStores.debugCamera.set(debugCamera) : '';

	const { activeCamera } = rendererStores;
	const { eyesPosition, eyesQuat, sightsQuat, sightsPosition, sightsPosition2 } = cameraStores;

	const { strafing, playerPosition } = playerStores;

	const currentCameraPosition = new Vector3().copy($eyesPosition);
	const currentQuat = new Quaternion().copy($eyesQuat);

	const cameraSwapTween = tweened(0);

	$: {
		cameraSwapTween.set(0, { duration: 0 });
		if ($activeCamera === 'eyes') {
			cameraSwapTween.set(1, {
				easing: quadInOut,
				duration: 500
			});
		}

		if ($activeCamera === 'sights') {
			cameraSwapTween.set(1, {
				easing: quadInOut,
				duration: 800
			});
		}
	}
	useFrame(() => {
		if ($activeCamera === 'eyes') {
			currentCameraPosition.lerp($eyesPosition, $cameraSwapTween);
			currentQuat.slerp($eyesQuat, $cameraSwapTween);
		}

		if ($activeCamera === 'sights') {
			// currentCameraPosition.lerp($sightsPosition2, $cameraSwapTween);
			currentCameraPosition.copy($eyesPosition);
			// currentCameraPosition.x -= $sightsPosition.x - $playerPosition.x;
			// currentCameraPosition.z += $sightsPosition.z - $playerPosition.z;
			// currentQuat.slerp($sightsQuat, $cameraSwapTween);
			currentQuat.slerp($sightsQuat, 0.16);
			// currentQuat.slerp($eyesQuat, $cameraSwapTween);
		}

		if ($activeCamera === 'debug') {
			debugCamera?.lookAt($eyesPosition);
		}

		sightsCamera?.position.copy(currentCameraPosition);
		sightsCamera?.quaternion.copy(currentQuat);
	});
</script>

<T.PerspectiveCamera fov={60} near={0.0001} bind:ref={eyesCamera} let:ref>
	<AudioListener />
	<!-- <T.CameraHelper args={[ref]} /> -->
</T.PerspectiveCamera>

<T.PerspectiveCamera fov={60} near={0.0001} bind:ref={sightsCamera} let:ref>
	<!-- <T.CameraHelper args={[ref]} /> -->
</T.PerspectiveCamera>
<T.PerspectiveCamera fov={60} near={0.0001} bind:ref={debugCamera} position={[-2, 3, -2]} />
