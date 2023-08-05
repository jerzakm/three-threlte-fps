<script lang="ts">
	import { requestPointerLockWithUnadjustedMovement } from '$lib/util/pointerLock';
	import { useThrelte } from '@threlte/core';
	import { controlStores } from './controlStores';
	import { onDestroy } from 'svelte';
	import { useSystem } from '$lib/systems/_systems';

	const { allowPointerLock, allowMouseAim } = controlStores;
	const { controlsSystem } = useSystem();

	let pointerLocked = false;
	const { renderer } = useThrelte();

	renderer?.domElement.addEventListener('click', async () => {
		if (!pointerLocked && $allowPointerLock) {
			requestPointerLockWithUnadjustedMovement(renderer?.domElement);
		}
		if (pointerLocked && !$allowPointerLock) {
			document.exitPointerLock();
		}
	});

	$: pointerLocked && !allowPointerLock && document.exitPointerLock();

	document.addEventListener(
		'pointerlockchange',
		(e) => {
			pointerLocked = document.pointerLockElement ? true : false;
		},
		false
	);

	const handleMouseMove = ({ movementX, movementY }: MouseEvent) => {
		if ($allowMouseAim) controlsSystem.mouseMove(movementX, movementY);
	};

	onDestroy(() => {
		document.exitPointerLock();
	});
</script>

<svelte:window on:mousemove={handleMouseMove} />
