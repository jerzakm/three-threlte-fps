<script lang="ts">
	import type { Collider as RCollider, RigidBody as RRigidBody } from '@dimforge/rapier3d-compat';
	import Gun from '$lib/gun/Gun.svelte';

	import { T, useFrame } from '@threlte/core';
	import { Collider, RigidBody, useRapier } from '@threlte/rapier';
	import { useKeyboardControls } from 'svelte-kbc';
	import { Quaternion, Vector3 } from 'three';
	import { rendererStores } from '$lib/renderer/rendererStores';
	import { cameraStores } from '$lib/renderer/cameraStores';
	import { playerStores } from './playerStores';

	const { playerPosition } = playerStores;

	const { left, right, forward, back, run } = useKeyboardControls();

	const RUN_SPEED = 9;
	const WALK_SPEED = 3;

	function clamp(number: number, min: number, max: number) {
		return Math.max(min, Math.min(number, max));
	}

	let recoil: any;

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

	const mouseSensitivity = 0.0012;

	window.addEventListener('mousemove', (e) => {
		mouseMove.x += e.movementX;
		mouseMove.y += e.movementY;
	});

	let phi = 0;
	let theta = 0;

	let gunphi = 0;
	let guntheta = 0;

	const { eyesCamera } = rendererStores;
	const { eyesPosition, eyesQuat, sightsPosition2 } = cameraStores;

	useFrame(({ clock }) => {
		if (!$eyesCamera) return;
		if (!recoil) return;

		phi += mouseMove.x * mouseSensitivity + $recoil.x;
		theta = clamp(theta - mouseMove.y * mouseSensitivity + $recoil.y, -Math.PI / 3, Math.PI / 3);
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

		playerStores.strafing.set(0);
		if ($left || $right || $forward || $back) {
			let speed = 0.05;

			let s = 0;
			let f = 0;

			if ($run) {
				speed = RUN_SPEED;
			} else speed = WALK_SPEED;

			if ($forward) {
				f -= 1;
			}
			if ($back) {
				f += 1;
			}

			if ($left) {
				s -= 1;
				playerStores.strafing.set(-1);
			}

			if ($right) {
				s += 1;

				playerStores.strafing.set(1);
			}

			const direction = new Vector3(s, 0, f);

			direction.applyQuaternion($eyesCamera.quaternion);
			direction.setY(0);
			direction.normalize().multiplyScalar(speed);
			characterController.computeColliderMovement(
				playerCollider, // The collider we would like to move.
				{ x: 0, y: 0, z: 0 } // The movement we would like to apply if there wasn’t any obstacle.
			);
			// let correctedMovement = characterController.computedMovement();
			playerBody.setLinvel(direction, true);
		}

		const translation = playerBody.translation();

		playerPosition.set({
			x: translation.x,
			y: translation.y,
			z: translation.z
		});

		$eyesCamera.position.set(translation.x, translation.y + 1.9, translation.z);

		// $sightsPosition2.copy($eyesCamera.position);
		$eyesPosition.copy($eyesCamera.position);
	});
</script>

<T.Group position={[0, 0.5, 0]}>
	<RigidBody bind:rigidBody={playerBody} linearDamping={5} gravityScale={1}>
		<T.Mesh>
			<T.CylinderGeometry args={[0.2, 0.2, 0.8]} />
			<T.MeshStandardMaterial color={'red'} />
		</T.Mesh>
		<Collider shape="capsule" args={[0.3, 0.2]} bind:collider={playerCollider} />
	</RigidBody>
</T.Group>

<Gun phi={gunphi} theta={guntheta} bind:recoil />
