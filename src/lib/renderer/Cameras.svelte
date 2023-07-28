<script lang="ts">
	import { T, useFrame } from '@threlte/core';
	import { AudioListener } from '@threlte/extras';
	import { Vector3, type PerspectiveCamera, Quaternion, CameraHelper } from 'three';
	import { rendererStores } from './rendererStores';
	import { cameraStores } from './cameraStores';
	import { quadInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	let eyesCamera: PerspectiveCamera | undefined = undefined;
	let sightsCamera: PerspectiveCamera | undefined = undefined;
	let debugCamera: PerspectiveCamera | undefined = undefined;

	$: eyesCamera ? rendererStores.eyesCamera.set(eyesCamera) : '';
	$: sightsCamera ? rendererStores.sightsCamera.set(sightsCamera) : '';
	$: debugCamera ? rendererStores.debugCamera.set(debugCamera) : '';

	const { activeCamera } = rendererStores;
	const { eyesPosition, eyesQuat, sightsQuat, sightsPosition } = cameraStores;

	const currentCameraPosition = new Vector3().copy($eyesPosition);
	const currentQuat = new Quaternion().copy($eyesQuat);

	const time = tweened(0);

	$: {
		time.set(0, { duration: 0 });
		if ($activeCamera === 'eyes') {
			time.set(1, {
				easing: quadInOut,
				duration: 350
			});
		}

		if ($activeCamera === 'sights') {
			time.set(1, {
				easing: quadInOut,
				duration: 350
			});
		}
	}
	let lastTime = 0;
	useFrame(({ clock }) => {
		let currentTime = clock.getElapsedTime();
		const delta = currentTime - lastTime;
		lastTime = currentTime;

		const positionSpeed = delta * 20 * $time;
		const quatSpeed = delta * 150 * $time;

		if ($activeCamera === 'eyes') {
			currentCameraPosition.lerp($eyesPosition, positionSpeed);
			currentQuat.slerp($eyesQuat, quatSpeed);
		}

		if ($activeCamera === 'sights') {
			currentCameraPosition.lerp($sightsPosition, positionSpeed);
			currentQuat.slerp($sightsQuat, quatSpeed);
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
	<T.CameraHelper args={[ref]} />
</T.PerspectiveCamera>

<T.PerspectiveCamera fov={60} near={0.0001} bind:ref={sightsCamera} let:ref>
	<T.CameraHelper args={[ref]} />
</T.PerspectiveCamera>
<T.PerspectiveCamera fov={60} near={0.0001} bind:ref={debugCamera} position={[-2, 3, -2]} />
