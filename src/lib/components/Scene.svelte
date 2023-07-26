<script lang="ts">
	import { T } from '@threlte/core';
	import { DEG2RAD } from 'three/src/math/MathUtils';
	import { ContactShadows, Float, Grid, OrbitControls } from '@threlte/extras';

	import { AutoColliders, Collider, Debug, World } from '@threlte/rapier';
	import { DoubleSide } from 'three';
	import Player from './player/Player.svelte';
</script>

<T.PerspectiveCamera makeDefault position={[-30, 30, 30]} fov={60} near={0.0001}>
	<!-- <OrbitControls enableZoom={true} target.y={1.5} /> -->
</T.PerspectiveCamera>

<T.DirectionalLight intensity={0.8} position.x={5} position.y={10} />
<T.AmbientLight intensity={0.2} />

<Grid
	position.y={0.13}
	cellColor="#ff0000"
	sectionColor="#ffffff"
	sectionThickness={0}
	fadeDistance={40}
	cellSize={1}
	gridSize={[200, 200]}
/>

<World>
	<Player />

	<AutoColliders>
		<T.Mesh>
			<T.BoxGeometry args={[100, 0.2, 100]} />
			<T.MeshStandardMaterial color="#45aa44" wireframe />
		</T.Mesh>
	</AutoColliders>

	{#if true}
		<Debug depthTest={true} depthWrite={true} side={DoubleSide} />
	{/if}
</World>
