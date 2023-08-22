<script lang="ts">
	import M4 from '$lib/components/models/M4.svelte';
	import { T, useFrame } from '@threlte/core';
	import { rendererStores } from '$lib/renderer/rendererStores';
	import { Quaternion, Vector3, type Group, PointLight } from 'three';
	import { DEG2RAD } from 'three/src/math/MathUtils';
	import { useSystem } from '$lib/systems/_systems';
	import { soundMap } from '$lib/systems/soundSystem';
	import { tweened } from 'svelte/motion';
	import { useGameData } from '$lib/systems/_gameData';
	import { controlStores } from '$lib/controls/controlStores';
	import { gunStores } from './gunStores';
	import MuzzleFlash from './MuzzleFlash.svelte';

	const { eyesCamera, activeCamera } = rendererStores;
	const { shotPulse } = gunStores;

	let m4: Group;

	//https://www.youtube.com/watch?v=zc_8QMltpnU&ab_channel=Ish%27sTacticalSolutions
	// https://www.youtube.com/watch?v=DuS9XnY-IRA&ab_channel=ColionNoir

	let x = 0;
	let y = 0;
	let z = 0;

	const { gunData } = useGameData();

	useFrame(({ clock }) => {
		if ($eyesCamera) {
			x = $eyesCamera.position.x;
			y = $eyesCamera.position.y;
			z = $eyesCamera.position.z;
		}

		const { phi, theta } = gunData.orientation;

		const qx = new Quaternion();
		qx.setFromAxisAngle(new Vector3(0, -1, 0), phi);

		const qz = new Quaternion();
		qz.setFromAxisAngle(new Vector3(1, 0, 0), -theta);

		const gunQuat = new Quaternion();
		gunQuat.multiply(qx);
		gunQuat.multiply(qz);

		m4.quaternion.copy(gunQuat);
	});

	let barrelStart: Vector3 = new Vector3();
	let barrelEnd: Vector3 = new Vector3();
	let barrelDirection = new Vector3();

	let shooting = false;

	const { bulletSystem, soundSystem } = useSystem();

	const { flashIntensity } = gunStores;

	const shoot = () => {
		barrelDirection.subVectors(barrelStart, barrelEnd).multiplyScalar(1200);
		flashIntensity.set(2, { duration: 0 });
		gunStores.shotPulse.set(true);
		setTimeout(() => {
			gunStores.flashIntensity.set(0, { duration: 50 });
		}, 20);

		barrelStart = barrelStart;

		bulletSystem?.spawnBullet({
			origin: [barrelStart.x, barrelStart.y, barrelStart.z],
			target: [barrelEnd.x, barrelEnd.y, barrelEnd.z],
			velocity: 1200,
			dropoff: 2
		});

		soundSystem.makeSound({
			origin: barrelStart,
			sound: soundMap.shot,
			volume: 2,
			coneInnerAngle: 360,
			coneOuterAngle: 360,
			coneOuterGain: 1
		});

		gunData.recoil.set(
			{ x: (Math.random() - 0.5) * 0.0012, y: 0.0001 + Math.random() * 0.0005 },
			{
				duration: 1
			}
		);
	};

	$: {
		if (!shooting) {
			gunData.recoil.set(
				{ x: 0, y: 0 },
				{
					duration: 0
				}
			);
		}
	}

	const { allowAds } = controlStores;

	const mouseDown = (e: MouseEvent) => {
		if (e.button === 0) {
			if (barrelStart && barrelEnd) {
				barrelStart = barrelStart;
				shooting = true;
			}
		}

		if (e.button === 2 && $allowAds) {
			$activeCamera === 'eyes' ? activeCamera.set('sights') : activeCamera.set('eyes');
		}
	};

	const mouseUp = (e: MouseEvent) => {
		if (e.button === 0) {
			if (barrelStart && barrelEnd) {
				shooting = false;
			}
		}

		if (e.button === 2 && $allowAds) {
			$activeCamera === 'eyes' ? activeCamera.set('sights') : activeCamera.set('eyes');
		}
	};
	let lastShot = 0;

	const shotDelay = 60 / 700;

	useFrame(({ clock }) => {
		const time = clock.getElapsedTime();
		const sinceLastShot = time - lastShot;
		gunStores.shotPulse.set(false);
		gunStores.barrelStart.set(barrelStart);
		gunStores.barrelEnd.set(barrelEnd);
		if (shooting && sinceLastShot > shotDelay) {
			gunStores.shotPulse.set(true);
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
		shooting={$shotPulse}
	/>
</T.Group>
<MuzzleFlash />
