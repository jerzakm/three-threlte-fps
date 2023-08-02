<script lang="ts">
	import M4 from '$lib/components/models/M4.svelte';
	import { T, useFrame } from '@threlte/core';
	import { useRapier } from '@threlte/rapier';
	import { rendererStores } from '$lib/renderer/rendererStores';
	import { Quaternion, Vector3, type Group, PointLight } from 'three';
	import { DEG2RAD } from 'three/src/math/MathUtils';
	import { useSystem } from '$lib/systems/_systems';
	import { soundMap } from '$lib/systems/soundSystem';
	import { tweened } from 'svelte/motion';

	const { eyesCamera, activeCamera } = rendererStores;

	let m4: Group;

	//https://www.youtube.com/watch?v=zc_8QMltpnU&ab_channel=Ish%27sTacticalSolutions
	// https://www.youtube.com/watch?v=DuS9XnY-IRA&ab_channel=ColionNoir

	let x = 0;
	let y = 0;
	let z = 0;

	export let phi = 0;
	export let theta = 0;

	const { rapier, world, colliderEventDispatchers } = useRapier();

	useFrame(({ clock }) => {
		if ($eyesCamera) {
			x = $eyesCamera.position.x;
			y = $eyesCamera.position.y;
			z = $eyesCamera.position.z;
		}

		const qx = new Quaternion();
		qx.setFromAxisAngle(new Vector3(0, -1, 0), phi);

		const qz = new Quaternion();
		qz.setFromAxisAngle(new Vector3(1, 0, 0), -theta);

		const gunQuat = new Quaternion();
		gunQuat.multiply(qx);
		gunQuat.multiply(qz);

		m4.quaternion.copy(gunQuat);
		// m4.setRotationFromQuaternion(gunQuat);
	});

	let barrelStart: Vector3 = new Vector3();
	let barrelEnd: Vector3 = new Vector3();
	let barrelDirection = new Vector3();

	let shooting = false;
	let shotPulse = false;

	const { bulletSystem, soundSystem } = useSystem();

	const flashIntensity = tweened(0);

	const shoot = () => {
		barrelDirection.subVectors(barrelStart, barrelEnd).multiplyScalar(1200);
		flashIntensity.set(2, { duration: 0 });
		shotPulse = true;
		setTimeout(() => {
			flashIntensity.set(0, { duration: 50 });
		}, 20);

		barrelStart = barrelStart;

		bulletSystem?.spawnBullet({
			origin: [barrelStart.x, barrelStart.y, barrelStart.z],
			target: [barrelEnd.x, barrelEnd.y, barrelEnd.z],
			velocity: 1200,
			dropoff: 3
		});

		soundSystem.makeSound({
			origin: barrelStart,
			sound: soundMap.shot,
			volume: 2,
			coneInnerAngle: 360,
			coneOuterAngle: 360,
			coneOuterGain: 1
		});
	};

	const mouseDown = (e: MouseEvent) => {
		if (e.button === 0) {
			if (barrelStart && barrelEnd) {
				barrelStart = barrelStart;
				shooting = true;
			}
		}

		if (e.button === 2) {
			$activeCamera === 'eyes' ? activeCamera.set('sights') : activeCamera.set('eyes');
		}
	};

	const mouseUp = (e: MouseEvent) => {
		if (e.button === 0) {
			if (barrelStart && barrelEnd) {
				shooting = false;
			}
		}

		if (e.button === 2) {
			$activeCamera === 'eyes' ? activeCamera.set('sights') : activeCamera.set('eyes');
		}
	};

	let lastShot = 0;

	const shotDelay = 60 / 700;

	useFrame(({ clock }) => {
		const time = clock.getElapsedTime();
		const sinceLastShot = time - lastShot;
		shotPulse = false;
		if (shooting && sinceLastShot > shotDelay) {
			shotPulse = true;
			shoot();
			lastShot = time * 1;
		}
	});
</script>

<svelte:window on:mousedown={mouseDown} on:mouseup={mouseUp} />

<T.Group position={[x, y, z]} rotation.y={-DEG2RAD * 180} scale={0.03}>
	<M4
		bind:ref={m4}
		bind:startPosition={barrelStart}
		bind:endPosition={barrelEnd}
		shooting={shotPulse}
	/>
</T.Group>

<T.PointLight
	intensity={$flashIntensity}
	distance={80}
	position={[barrelStart.x, barrelStart.y, barrelStart.z]}
	color={'#aa6622'}
/>

<T.PointLight
	intensity={$flashIntensity * 0.2}
	distance={1}
	position={[barrelStart.x, barrelStart.y + 0.5, barrelStart.z]}
	color={'#aacc22'}
/>
