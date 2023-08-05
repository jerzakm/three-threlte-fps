<script lang="ts">
	import { requestPointerLockWithUnadjustedMovement } from '$lib/util/pointerLock';
	import { useThrelte } from '@threlte/core';

	let pointerLocked = false;
	const { renderer } = useThrelte();

	renderer?.domElement.addEventListener('click', async () => {
		if (!pointerLocked) {
			requestPointerLockWithUnadjustedMovement(renderer?.domElement);
		}
		// const y = renderer?.domElement.requestPointerLock();
	});

	document.addEventListener(
		'pointerlockchange',
		(e) => {
			pointerLocked = !pointerLocked;
		},
		false
	);
</script>
