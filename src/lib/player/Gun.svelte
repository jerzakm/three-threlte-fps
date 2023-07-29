<script lang="ts">
	import M4 from '$lib/components/models/M4.svelte';
	import type { Collider } from '@dimforge/rapier3d-compat';
	import { PositionalAudio } from '@threlte/extras';
	import { PositionalAudioHelper } from 'three/examples/jsm/helpers/PositionalAudioHelper.js';
	import { T, useFrame } from '@threlte/core';
	import { useRapier } from '@threlte/rapier';
	import { rendererStores } from '$lib/renderer/rendererStores';
	import { Quaternion, Vector3, type Group } from 'three';
	import { DEG2RAD } from 'three/src/math/MathUtils';
	import { useSystem } from '$lib/systems/gameSystems';

	const { eyesCamera, activeCamera } = rendererStores;

	let m4: Group;

	//https://www.youtube.com/watch?v=zc_8QMltpnU&ab_channel=Ish%27sTacticalSolutions
	// https://www.youtube.com/watch?v=DuS9XnY-IRA&ab_channel=ColionNoir

	let x = 0;
	let y = 0;
	let z = 0;

	export let phi = 0;
	export let theta = 0;

	const { rapier, world } = useRapier();

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

	let barrelStart: Vector3;
	let barrelEnd: Vector3;
	let barrelDirection = new Vector3();

	const bullets: (Collider | undefined)[] = [];

	useFrame(() => {
		for (let i = 0; i < bullets.length; i++) {
			const bullet = bullets[i];

			// sound.play();

			if (bullet) {
				world.contactsWith(bullet, (otherCollider) => {
					bullet.parent()?.setLinvel({ x: 0, y: 0, z: 0 }, true);
					if (bullets[i] && bullets[i]?.parent()) {
						const position = bullet.translation();
						if (position) {
							const impactAudio = [impact1, impact2, impact3];

							impactIndex < impactAudio.length - 1 ? impactIndex++ : (impactIndex = 0);

							impactAudio[impactIndex].stop();

							impactAudio[impactIndex].parent.position.x = position.x;
							impactAudio[impactIndex].parent.position.y = position.y;
							impactAudio[impactIndex].parent.position.z = position.z;
							impactAudio[impactIndex].play();
						}
						//@ts-ignore
						world.removeRigidBody(bullet.parent());
						world.removeCollider(bullet, false);
						bullets[i] = undefined;
					}
				});
			}
		}
	});

	let shooting = false;

	let audio1: any;
	let audio2: any;
	let audio3: any;
	let impact1: any;
	let impact2: any;
	let impact3: any;

	let shotIndex = 0;
	let impactIndex = 0;

	const { bulletSystem } = useSystem();

	const shoot = () => {
		const shotsAudio = [audio1, audio2, audio3];

		shotIndex < shotsAudio.length - 1 ? shotIndex++ : (shotIndex = 0);

		shotsAudio[shotIndex].stop();

		shotsAudio[shotIndex].parent.position.x = barrelStart.x;
		shotsAudio[shotIndex].parent.position.y = barrelStart.y;
		shotsAudio[shotIndex].parent.position.z = barrelStart.z;

		// shotsAudio[shotIndex].position = barrelEnd;
		shotsAudio[shotIndex].play();
		shooting = true;
		barrelDirection.subVectors(barrelStart, barrelEnd).multiplyScalar(1200);

		const { x, y, z } = barrelStart;

		let colliderDesc = rapier.ColliderDesc.ball(0.1);
		let rigidBodyDesc = new rapier.RigidBodyDesc(rapier.RigidBodyType.Dynamic)
			.setTranslation(x, y, z)
			.setLinvel(barrelDirection.x, barrelDirection.y, barrelDirection.z)
			.setUserData({
				type: 'bullet'
			})
			.setGravityScale(3)
			.setCanSleep(false)
			.setCcdEnabled(true);

		// let rigidBody = world.createRigidBody(rigidBodyDesc);

		// let collider = world.createCollider(colliderDesc, rigidBody);

		// collider.setRestitution(0);

		// bullets.push(collider);
		setTimeout(() => {
			shooting = false;
		}, 200);

		bulletSystem?.spawnBullet({
			origin: [barrelStart.x, barrelStart.y, barrelStart.z],
			target: [barrelEnd.x, barrelEnd.y, barrelEnd.z],
			velocity: 1200,
			dropoff: 3
		});
	};

	const handleClick = (e: MouseEvent) => {
		if (e.button === 0) {
			if (barrelStart && barrelEnd) {
				shoot();
			}
		}

		if (e.button === 2) {
			//optics
			$activeCamera === 'eyes' ? activeCamera.set('sights') : activeCamera.set('eyes');
		}
	};

	const directionalCone = {
		coneInnerAngle: 360,
		coneOuterAngle: 360,
		coneOuterGain: 0.9
	};

	const impactDirectionalCone = {
		coneInnerAngle: 360,
		coneOuterAngle: 360,
		coneOuterGain: 0.5
	};

	const impactRolloff = 0.18;

	const shotVolume = 1.7;

	const impactVolume = 3;
</script>

<svelte:window on:click={handleClick} />

<T.Group position={[x, y, z]} rotation.y={-DEG2RAD * 180} scale={0.03}>
	<M4 bind:ref={m4} bind:startPosition={barrelStart} bind:endPosition={barrelEnd} {shooting} />
</T.Group>
<T.Mesh>
	<PositionalAudio
		autostart
		volume={shotVolume}
		src={'/audio/m4shot.mp3'}
		bind:ref={audio1}
		let:ref
		{directionalCone}
	>
		<!-- <T is={PositionalAudioHelper} args={[ref]} /> -->
	</PositionalAudio>
</T.Mesh>
<T.Mesh>
	<PositionalAudio
		autostart
		volume={shotVolume}
		src={'/audio/m4shot.mp3'}
		bind:ref={audio2}
		{directionalCone}
		let:ref
	>
		<!-- <T is={PositionalAudioHelper} args={[ref]} /> -->
	</PositionalAudio>
</T.Mesh>
<T.Mesh>
	<PositionalAudio
		autostart
		volume={shotVolume}
		src={'/audio/m4shot.mp3'}
		bind:ref={audio3}
		{directionalCone}
		let:ref
	>
		<!-- <T is={PositionalAudioHelper} args={[ref]} /> -->
	</PositionalAudio>
</T.Mesh>

<T.Mesh>
	<PositionalAudio
		autostart
		volume={impactVolume}
		refDistance={1}
		src={'/audio/impact2.mp3'}
		bind:ref={impact1}
		directionalCone={impactDirectionalCone}
		rolloffFactor={impactRolloff}
		let:ref
	>
		<T is={PositionalAudioHelper} args={[ref]} />
	</PositionalAudio>
</T.Mesh>

<T.Mesh>
	<PositionalAudio
		autostart
		refDistance={1}
		volume={impactVolume}
		rolloffFactor={impactRolloff}
		src={'/audio/impact2.mp3'}
		bind:ref={impact2}
		directionalCone={impactDirectionalCone}
		let:ref
	>
		<T is={PositionalAudioHelper} args={[ref]} /></PositionalAudio
	>
</T.Mesh>

<T.Mesh>
	<PositionalAudio
		autostart
		refDistance={1}
		volume={impactVolume}
		src={'/audio/impact2.mp3'}
		bind:ref={impact3}
		directionalCone={impactDirectionalCone}
		let:ref
		rolloffFactor={impactRolloff}
	>
		<T is={PositionalAudioHelper} args={[ref]} /></PositionalAudio
	>
</T.Mesh>
