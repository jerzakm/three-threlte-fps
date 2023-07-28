<script lang="ts">
	import { T } from '@threlte/core';
	import { DEG2RAD } from 'three/src/math/MathUtils';
	import { ContactShadows, Environment, Float, Grid, OrbitControls } from '@threlte/extras';
	import { AudioListener, PositionalAudio } from '@threlte/extras';

	import { AutoColliders, Collider, Debug, World } from '@threlte/rapier';
	import { DoubleSide } from 'three';
	import Player from '$lib/player/Player.svelte';
	import Wall from '$lib/components/models/Wall.svelte';
</script>

<T.PerspectiveCamera makeDefault position={[-30, 30, 30]} fov={60} near={0.0001}>
	<!-- <OrbitControls enableZoom={true} target.y={1.5} /> -->
	<AudioListener />
</T.PerspectiveCamera>

<!-- <T.DirectionalLight intensity={0.8} position.x={0} position.y={2} />
<T.DirectionalLight intensity={0.8} position.x={0} position.y={2} position.z={-14} />
<T.AmbientLight intensity={0.5} /> -->

<Environment files={'spaichingen_hill_1k.hdr'} />

<Grid
	position.y={0.1}
	cellColor="#000000"
	sectionColor="#00000"
	sectionThickness={0}
	fadeDistance={40}
	cellSize={1}
	gridSize={[200, 200]}
/>

<World>
	<Player />

	<AutoColliders>
		<T.Mesh>
			<T.BoxGeometry args={[100, 0.05, 100]} />
			<T.MeshStandardMaterial color="#cccccc" />
		</T.Mesh>
		<T.Mesh position.x={20} position.z={-50} position.y={2}>
			<T.BoxGeometry args={[4, 4, 4]} />
			<T.MeshStandardMaterial color="#444444" />
		</T.Mesh>
	</AutoColliders>

	<AutoColliders>
		<T.Mesh position.z={-25} position.y={2}>
			<T.BoxGeometry args={[4, 4, 4]} />
			<T.MeshStandardMaterial color="#444444" />
		</T.Mesh>
	</AutoColliders>

	{#each { length: 10 } as d, x}
		{#each { length: 10 } as rz, z}
			<AutoColliders>
				<T.Mesh position.x={(x - 5) * 20 + 3} position.z={(z - 5) * 50 + 5} position.y={2}>
					<T.BoxGeometry args={[4, 4, 4]} />
					<T.MeshStandardMaterial color="#444444" />
				</T.Mesh>
			</AutoColliders>
		{/each}
	{/each}

	<!-- <Wall scale={0.01} position={[0, 0, -6]} rotation.y={DEG2RAD * -10} /> -->

	{#if true}
		<Debug depthTest={true} depthWrite={true} side={DoubleSide} />
	{/if}
</World>
