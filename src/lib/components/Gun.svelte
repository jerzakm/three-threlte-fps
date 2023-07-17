<script lang="ts">
	import { T, useFrame, useThrelte } from '@threlte/core';
	import M4 from './models/M4.svelte';
	import type { Euler, Group } from 'three';
	import { DEG2RAD } from 'three/src/math/MathUtils';

	const { camera } = useThrelte();

	export let cameraRotation: Euler;

	let m4: Group;

	let x = 0;
	let y = 0;
	let z = 0;

	useFrame(() => {
		x = $camera.position.x;
		y = $camera.position.y;
		z = $camera.position.z;

		const gunRotation = cameraRotation;

		// gunRotation.x += 1;

		m4.setRotationFromEuler(gunRotation);
	});
</script>

<T.Group scale={0.1} position={[x, y, z]} rotation.y={-DEG2RAD * 180}>
	<M4 bind:ref={m4} />
</T.Group>
