<script lang="ts">
	import { controlStores } from '$lib/controls/controlStores';
	import { gunStores } from '$lib/gun/gunStores';
	import { useGameData } from '$lib/systems/_gameData';
	import { useSystem } from '$lib/systems/_systems';
	import { soundMap } from '$lib/systems/soundSystem';
	import { useFrame } from '@threlte/core';
	import { onDestroy } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { Vector3 } from 'three';

	export let adsAllow: boolean;

	export let autoShoot: {
		active: boolean;
		rpm: number;
	};

	$: controlStores.allowAds.set(adsAllow);

	const { barrelStart, barrelEnd } = gunStores;

	const { bulletSystem, soundSystem } = useSystem();
	const { gunData } = useGameData();

	let barrelDirection = new Vector3();

	// $: autoShoot && queueShot();

	const shoot = () => {
		barrelDirection.subVectors($barrelStart, $barrelEnd).multiplyScalar(1200);
		gunStores.flashIntensity.set(2, { duration: 0 });
		setTimeout(() => {
			gunStores.flashIntensity.set(0, { duration: 50 });
		}, 20);
		gunStores.shotPulse.set(true);
		bulletSystem?.spawnBullet({
			origin: [$barrelStart.x, $barrelStart.y, $barrelStart.z],
			target: [$barrelEnd.x, $barrelEnd.y, $barrelEnd.z],
			velocity: 400,
			dropoff: 3
		});

		soundSystem.makeSound({
			origin: $barrelStart,
			sound: soundMap.shot,
			volume: 0.2,
			coneInnerAngle: 360,
			coneOuterAngle: 360,
			coneOuterGain: 1
		});

		// gunData.recoil.set(
		// 	{ x: (Math.random() - 0.5) * 0.0012, y: 0.0001 + Math.random() * 0.0005 },
		// 	{
		// 		duration: 1
		// 	}
		// );
	};

	let lastShot = 0;
	$: shotFrequency = 60 / autoShoot.rpm;
	$: console.log({ shotFrequency });

	useFrame(({ clock }) => {
		let timeNow = clock.getElapsedTime() * 1;
		if (autoShoot.active && timeNow - lastShot >= shotFrequency) {
			shoot();
			lastShot = timeNow * 1;
		}
	});

	onDestroy(() => {
		controlStores.allowAds.set(true);
	});
</script>
