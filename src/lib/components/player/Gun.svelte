<script lang="ts">
	import M4 from '$lib/components/models/M4.svelte';
	import { T, useFrame, useThrelte } from '@threlte/core';
	import { Quaternion, Vector3, type Euler, type Group } from 'three';
	import { DEG2RAD } from 'three/src/math/MathUtils';

	const { camera } = useThrelte();

	export let cameraRotation: Euler;

	let m4: Group;

	let x = 0;
	let y = 0;
	let z = 0;

	export let phi = 0;
	export let theta = 0;

	useFrame(({ clock }) => {
		x = $camera.position.x;
		y = $camera.position.y;
		z = $camera.position.z;
		const time = clock.getElapsedTime();

		// const gunRotation = cameraRotation;

		// gunRotation.x += 1;

		const qx = new Quaternion();
		qx.setFromAxisAngle(new Vector3(0, -1, 0), phi);

		const qz = new Quaternion();
		qz.setFromAxisAngle(new Vector3(1, 0, 0), -theta);

		const gunQuat = new Quaternion();
		gunQuat.multiply(qx);
		gunQuat.multiply(qz);

		// gunQuat.w -= 1.9;
		// gunQuat.z += Math.sin(time);

		// x -= 0.5;

		m4.setRotationFromQuaternion(gunQuat);
	});
</script>

<T.Group scale={0.1} position={[x, y, z]} rotation.y={-DEG2RAD * 180}>
	<M4 bind:ref={m4} />
</T.Group>
