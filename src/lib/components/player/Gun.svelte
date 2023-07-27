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

	const GUN_SHIFT_SPEED = 40;

	let lastTime = 0;

	useFrame(({ clock }) => {
		x = $camera.position.x;
		// x+=1
		y = $camera.position.y;
		z = $camera.position.z;
		// z-=2.5
		const time = clock.getElapsedTime();
		const delta = time - lastTime;
		lastTime = time * 1;

		const qx = new Quaternion();
		qx.setFromAxisAngle(new Vector3(0, -1, 0), phi);

		const qz = new Quaternion();
		qz.setFromAxisAngle(new Vector3(1, 0, 0), -theta);

		const gunQuat = new Quaternion();
		gunQuat.multiply(qx);
		gunQuat.multiply(qz);

		// gunQuat.w -= 1.9;
		// gunQuat.z += Math.sin(time);

		m4.quaternion.slerp(gunQuat, delta * GUN_SHIFT_SPEED);

		// m4.setRotationFromQuaternion(gunQuat);
	});

	const handleClick = (e: MouseEvent) => {
		if (e.button === 0) {
			//shoot
		}

		if (e.button === 2) {
			//optics
		}
	};
</script>

<svelte:window on:click={handleClick} />

<T.Group scale={0.1} position={[x, y, z]} rotation.y={-DEG2RAD * 180}>
	<M4 bind:ref={m4} />
</T.Group>
