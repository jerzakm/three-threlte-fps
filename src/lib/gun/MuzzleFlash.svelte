<script lang="ts">
	import { T, useFrame } from '@threlte/core';
	import { gunStores } from './gunStores';
	import {
		CapsuleGeometry,
		CircleGeometry,
		DoubleSide,
		Group,
		MeshBasicMaterial,
		Quaternion,
		Texture,
		Vector3
	} from 'three';
	import { useTexture } from '@threlte/extras';
	import { DEG2RAD } from 'three/src/math/MathUtils';
	import { customShaderMaterial } from '$lib/shaders/customShaderMaterial';
	import type CustomShaderMaterial from 'three-custom-shader-material/vanilla';

	import vertexShader from '$lib/shaders/vertStandard.glsl?raw';
	import fragmentShader from '$lib/shaders/fragMuzzle.glsl?raw';
	import fragmentShader2 from '$lib/shaders/fragMuzzle2.glsl?raw';
	import { tweened } from 'svelte/motion';
	import { quadIn, quadOut, quintIn, quintInOut, quintOut } from 'svelte/easing';

	let muzzleGroup: Group;

	const { flashIntensity, barrelStart, barrelEnd, shotPulse } = gunStores;

	const muzzle = useTexture('/sprites/muzzle_side_1.jpeg');
	const muzzleFront = useTexture('/sprites/muzzle_front_2.jpeg');

	let muzzleSideMaterial: CustomShaderMaterial<typeof MeshBasicMaterial> | undefined;
	let muzzleFrontMaterial: CustomShaderMaterial<typeof MeshBasicMaterial> | undefined;

	const muzzleProgress = tweened(0, {
		duration: 90,
		easing: quintOut
	});

	$: {
		if ($shotPulse) {
			muzzleProgress.set(1, { duration: 0, easing: quadOut });
			muzzleProgress.set(0);
		}
	}

	const initializeMaterial = async (sideMap: Texture, frontMap: Texture) => {
		const csm = await customShaderMaterial();
		if (csm && $muzzle) {
			muzzleSideMaterial = new csm({
				baseMaterial: MeshBasicMaterial,
				map: sideMap,
				side: DoubleSide,
				vertexShader,
				fragmentShader: fragmentShader2,
				transparent: true,
				depthWrite: false,
				alphaTest: 0.0,
				uniforms: {
					progress: { value: $muzzleProgress },
					iTime: { value: 0 }
				}
			});

			muzzleFrontMaterial = new csm({
				baseMaterial: MeshBasicMaterial,
				map: frontMap,
				side: DoubleSide,
				vertexShader,
				fragmentShader: fragmentShader2,
				transparent: true,
				depthWrite: false,
				alphaTest: 0.0,
				uniforms: {
					progress: { value: $muzzleProgress },
					iTime: { value: 0 }
				}
			});
		}
	};
	let barrelDirection = new Vector3();

	const nQuat = new Quaternion();

	let timer = 0;

	useFrame(({ clock }) => {
		// update uniforms

		timer = clock.getElapsedTime();
		if (muzzleSideMaterial && muzzleFrontMaterial) {
			muzzleSideMaterial.uniforms.progress.value = $muzzleProgress;
			muzzleSideMaterial.uniforms.iTime.value = clock.getElapsedTime();
			muzzleFrontMaterial.uniforms.progress.value = $muzzleProgress;
			muzzleFrontMaterial.uniforms.iTime.value = clock.getElapsedTime();
			muzzleGroup.lookAt($barrelEnd);
		}
	});

	$: $muzzle && $muzzleFront && initializeMaterial($muzzle, $muzzleFront);

	$: $muzzle && muzzleSideMaterial && muzzleSideMaterial.needsUpdate;
</script>

<T.PointLight
	intensity={$flashIntensity}
	distance={80}
	position={[$barrelStart.x, $barrelStart.y, $barrelStart.z]}
	color={'#aa6622'}
/>

<T.PointLight
	intensity={$flashIntensity * 0.2}
	distance={1}
	position={[$barrelStart.x, $barrelStart.y + 0.5, $barrelStart.z]}
	color={'#aacc22'}
/>

<T.Group bind:ref={muzzleGroup} position={[$barrelStart.x, $barrelStart.y, $barrelStart.z]}>
	<!-- <T.Mesh
		rotation.x={DEG2RAD * 90}
		rotation.y={DEG2RAD * 45}
		rotation.z={DEG2RAD * 90}
		position.z={-0.1}
		scale={1}
	>
		<T.PlaneGeometry args={[1, 0.6]} />
		{#if muzzleSideMaterial}
			<T is={muzzleSideMaterial} />
		{/if}
	</T.Mesh>
	<T.Mesh
		rotation.x={DEG2RAD * 90}
		rotation.y={DEG2RAD * -45}
		rotation.z={DEG2RAD * 90}
		position.z={-0.1}
		scale={1}
	>
		<T.PlaneGeometry args={[1, 0.6]} />
		{#if muzzleSideMaterial}
			<T is={muzzleSideMaterial} />
		{/if}
	</T.Mesh> -->
	<!-- <T.Mesh
		position.z={0.03}
		rotation.x={DEG2RAD * 0}
		rotation.y={DEG2RAD * 0}
		rotation.z={DEG2RAD * Math.sin(timer * 10000) * 64}
		scale={0.45}
	>
		<T.RingGeometry args={[0, 0.09]} />
		{#if muzzleFrontMaterial}
			<T is={muzzleFrontMaterial} />
		{/if}
	</T.Mesh> -->
</T.Group>
