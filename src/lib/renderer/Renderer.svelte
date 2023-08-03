<script lang="ts">
	import { useRender, useThrelte } from '@threlte/core';
	import { onMount } from 'svelte';
	import { rendererStores } from './rendererStores';
	import { requestPointerLockWithUnadjustedMovement } from '$lib/util/pointerLock';
	import { PerspectiveCamera, WebGLRenderTarget } from 'three';
	import { cameraStores } from './cameraStores';
	import { gunStores } from '$lib/gun/gunStores';

	let pointerLocked = false;
	const { activeCamera, debugCamera, sightsCamera, sightsRenderTarget } = rendererStores;
	const { sightsPosition, sightsQuat } = cameraStores;
	const { renderer } = useThrelte();
	renderer?.domElement.addEventListener('click', async () => {
		if (!pointerLocked) {
			requestPointerLockWithUnadjustedMovement(renderer?.domElement);
		}
		// const y = renderer?.domElement.requestPointerLock();
	});

	$: {
		if (!$sightsRenderTarget) {
			sightsRenderTarget.set(
				new WebGLRenderTarget(window.innerWidth * 0.5, window.innerHeight * 0.5)
			);
		}
	}

	document.addEventListener(
		'pointerlockchange',
		(e) => {
			pointerLocked = !pointerLocked;
		},
		false
	);

	const x2camera = new PerspectiveCamera(5);

	const { gunObject3D } = gunStores;

	useRender(({ scene, renderer }) => {
		//

		// if ($activeCamera == 'eyes' && $eyesCamera) {
		// 	renderer?.render(scene, $eyesCamera);
		// }
		if ($gunObject3D) {
			$gunObject3D?.scale.set(0, 0, 0);
		}

		if ($sightsRenderTarget && $sightsCamera) {
			x2camera.position.set($sightsPosition.x, $sightsPosition.y - 0.1, $sightsPosition.z);
			x2camera.rotation.setFromQuaternion($sightsQuat);
			renderer?.setRenderTarget($sightsRenderTarget);
			renderer?.render(scene, x2camera);
		}

		renderer?.setRenderTarget(null);
		if ($gunObject3D) {
			$gunObject3D?.scale.set(1, 1, 1);
		}

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
