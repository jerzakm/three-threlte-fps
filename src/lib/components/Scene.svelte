<script lang="ts">
	import { T } from '@threlte/core';
	import { DEG2RAD } from 'three/src/math/MathUtils';
	import { ContactShadows, Float, Grid, OrbitControls } from '@threlte/extras';

	import { AutoColliders, Collider, Debug, World } from '@threlte/rapier';
	import { DoubleSide } from 'three';
	import Player from './Player.svelte';
	import Level from './models/Level.svelte';
</script>

<T.PerspectiveCamera makeDefault position={[-30, 30, 30]} fov={60}>
	<!-- <OrbitControls enableZoom={true} target.y={1.5} /> -->
</T.PerspectiveCamera>

<T.DirectionalLight intensity={0.8} position.x={5} position.y={10} />
<T.AmbientLight intensity={0.2} />

<!-- <Grid
	position.y={-0.001}
	cellColor="#ffffff"
	sectionColor="#ffffff"
	sectionThickness={0}
	fadeDistance={200}
	cellSize={2}
/> -->

<World>
	<Player />

	<!-- <AutoColliders>
		<T.Mesh>
			<T.BoxGeometry args={[100, 0.5, 100]} />
			<T.MeshStandardMaterial color="grey" wireframe />
		</T.Mesh>
	</AutoColliders> -->

	<T.Group position.x={25} position.z={25}>
		<Level />
	</T.Group>

	{#if true}
		<Debug depthTest={true} depthWrite={true} side={DoubleSide} />
	{/if}
</World>
