<script lang="ts">
	import { requestPointerLockWithUnadjustedMovement } from '$lib/util/pointerLock';
	import type { Collider as RCollider, RigidBody as RRigidBody } from '@dimforge/rapier3d-compat';
	import Gun from './Gun.svelte';

	import { T, useFrame, useThrelte } from '@threlte/core';
	import { Collider, RigidBody, useRapier } from '@threlte/rapier';
	import { useKeyboardControls } from 'svelte-kbc';
	import { Quaternion, Vector3 } from 'three';
	import { rendererStores } from '$lib/renderer/rendererStores';
	import { cameraStores } from '$lib/renderer/cameraStores';

	const { w, a, s, d, shift, space } = useKeyboardControls();

	const RUN_SPEED = 2;
	const WALK_SPEED = 1;

	function clamp(number: number, min: number, max: number) {
		return Math.max(min, Math.min(number, max));
	}

	let playerCollider: RCollider;
	let playerBody: RRigidBody;

	const { world } = useRapier();

	let characterController = world.createCharacterController(0.01);
	characterController.setMaxSlopeClimbAngle((45 * Math.PI) / 180);
	characterController.setMinSlopeSlideAngle((30 * Math.PI) / 180);
	characterController.enableAutostep(0.5, 0.2, true);
	characterController.enableSnapToGround(0.5);

	let cameraQuaternion;

	$: {
		if (playerBody) {
			playerBody.lockRotations(true, true);
		}
	}

	const mouseMove = {
		x: 0,
		y: 0
	};

	const mouseSensitivity = 0.002;

	window.addEventListener('mousemove', (e) => {
		mouseMove.x += e.movementX;
		mouseMove.y += e.movementY;
	});

	let phi = 0;
	let theta = 0;

	let gunphi = 0;
	let guntheta = 0;

	const { eyesCamera } = rendererStores;
	const { eyesPosition, eyesQuat } = cameraStores;

	useFrame(({ clock }) => {
		if (!$eyesCamera) return;
		phi += mouseMove.x * mouseSensitivity;
		theta = clamp(theta - mouseMove.y * mouseSensitivity, -Math.PI / 3, Math.PI / 3);
		gunphi = phi * 1;
		guntheta = theta * 1;
		const qx = new Quaternion();
		qx.setFromAxisAngle(new Vector3(0, -1, 0), phi);

		const qz = new Quaternion();
		qz.setFromAxisAngle(new Vector3(1, 0, 0), theta);

		cameraQuaternion = new Quaternion();
		cameraQuaternion.multiply(qx);
		cameraQuaternion.multiply(qz);

		mouseMove.x = 0;
		mouseMove.y = 0;

		$eyesCamera.quaternion.copy(cameraQuaternion);
		$eyesQuat.copy(cameraQuaternion);

		let xOffset = 0;

		if ($w || $a || $s || $d) {
			let speed = 0.05;

			let strafe = 0;
			let forward = 0;

			if ($shift) {
				speed = RUN_SPEED;
			} else speed = WALK_SPEED;

			if ($w) {
				forward -= speed;
			}
			if ($s) {
				forward += speed;
			}

			if ($a) {
				strafe -= speed;
				xOffset = -0.03;
			}
			a;

			if ($d) {
				strafe += speed;
			}

			const direction = new Vector3(strafe, 0, forward);

			direction.applyQuaternion($eyesCamera.quaternion);

			direction.setY(0);
			characterController.computeColliderMovement(
				playerCollider, // The collider we would like to move.
				{ x: 0, y: 0, z: 0 } // The movement we would like to apply if there wasn’t any obstacle.
			);
			// let correctedMovement = characterController.computedMovement();
			playerBody.setLinvel(direction, true);
		}

		const translation = playerBody.translation();

		$eyesCamera.position.set(translation.x, translation.y + 1.9, translation.z);

		$eyesPosition.copy($eyesCamera.position);
	});
</script>

<T.Group position={[0, 0.5, 0]}>
	<RigidBody bind:rigidBody={playerBody} linearDamping={0} gravityScale={1}>
		<T.Mesh>
			<T.CylinderGeometry args={[0.2, 0.2, 0.8]} />
			<T.MeshStandardMaterial color={'red'} />
		</T.Mesh>
		<Collider shape="capsule" args={[0.3, 0.2]} bind:collider={playerCollider} />
	</RigidBody>
</T.Group>

<Gun phi={gunphi} theta={guntheta} />