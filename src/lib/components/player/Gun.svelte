<script lang="ts">
	import M4 from '$lib/components/models/M4.svelte';
	import type { Collider } from '@dimforge/rapier3d-compat';
	import { AudioListener, PositionalAudio } from '@threlte/extras';
	import { PositionalAudioHelper } from 'three/examples/jsm/helpers/PositionalAudioHelper.js';

	import { T, useFrame, useThrelte } from '@threlte/core';
	import { useRapier } from '@threlte/rapier';
	import { Howl } from 'howler';
	import { onMount } from 'svelte';
	import { Quaternion, Vector3, type Euler, type Group } from 'three';
	import { DEG2RAD } from 'three/src/math/MathUtils';

	const { camera } = useThrelte();

	let m4: Group;

	//https://www.youtube.com/watch?v=zc_8QMltpnU&ab_channel=Ish%27sTacticalSolutions
	// https://www.youtube.com/watch?v=DuS9XnY-IRA&ab_channel=ColionNoir

	let x = 0;
	let y = 0;
	let z = 0;

	export let phi = 0;
	export let theta = 0;

	const GUN_SHIFT_SPEED = 40;

	let lastTime = 0;

	const { rapier, world } = useRapier();

	// world.maxVelocityIterations = 32;

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

	let barrelStart: Vector3;
	let barrelEnd: Vector3;

	let barrelDirection = new Vector3();

	const bullets: (Collider | undefined)[] = [];

	let sound;

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

	onMount(() => {
		sound = new Howl({
			src: ['/audio/m4shot.wav'],
			autoplay: false,
			loop: false,
			volume: 0.1
		});
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

	const shoot = () => {
		const shotsAudio = [audio1, audio2, audio3];

		shotIndex < shotsAudio.length - 1 ? shotIndex++ : (shotIndex = 0);

		shotsAudio[shotIndex].stop();

		console.log(shotsAudio[shotIndex].parent.position);

		shotsAudio[shotIndex].parent.position.x = barrelStart.x;
		shotsAudio[shotIndex].parent.position.y = barrelStart.y;
		shotsAudio[shotIndex].parent.position.z = barrelStart.z;
		console.log(shotsAudio[shotIndex].parent.position);

		// shotsAudio[shotIndex].position = barrelEnd;
		shotsAudio[shotIndex].play();
		shooting = true;
		barrelDirection.subVectors(barrelStart, barrelEnd).multiplyScalar(500);

		const { x, y, z } = barrelStart;

		let colliderDesc = rapier.ColliderDesc.ball(0.1);
		let rigidBodyDesc = new rapier.RigidBodyDesc(rapier.RigidBodyType.Dynamic)
			.setTranslation(x, y, z)
			.setLinvel(barrelDirection.x, barrelDirection.y, barrelDirection.z)
			.setUserData({
				type: 'bullet'
			})
			.setGravityScale(0.01)
			.setCanSleep(false)
			.setCcdEnabled(true);

		let rigidBody = world.createRigidBody(rigidBodyDesc);

		let collider = world.createCollider(colliderDesc, rigidBody);

		collider.setRestitution(0);

		bullets.push(collider);
		setTimeout(() => {
			shooting = false;
		}, 200);
	};

	$: console.log(barrelStart);
	$: console.log(barrelEnd);

	const handleClick = (e: MouseEvent) => {
		if (e.button === 0) {
			if (barrelStart && barrelEnd) {
				shoot();
			}
		}

		if (e.button === 2) {
			//optics
		}
	};

	const directionalCone = {
		coneInnerAngle: 50,
		coneOuterAngle: 220,
		coneOuterGain: 0.9
	};

	const impactDirectionalCone = {
		coneInnerAngle: 50,
		coneOuterAngle: 220,
		coneOuterGain: 0.9
	};

	const impactRolloff = 0.3;

	const shotVolume = 2;

	const impactVolume = 3;
</script>

<svelte:window on:click={handleClick} />

<T.Group scale={0.02} position={[x, y, z]} rotation.y={-DEG2RAD * 180}>
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
