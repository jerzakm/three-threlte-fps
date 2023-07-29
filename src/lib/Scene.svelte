<script lang="ts">
	import { T } from '@threlte/core';
	import { Environment, Grid } from '@threlte/extras';

	import Player from '$lib/player/Player.svelte';
	import { AutoColliders, Debug, World } from '@threlte/rapier';
	import { DoubleSide } from 'three';
	import { onMount } from 'svelte';
	import { rendererStores } from './renderer/rendererStores';
	import GameWorld from './GameWorld.svelte';

	const { activeCamera } = rendererStores;

	onMount(() => {
		activeCamera.set('eyes');
	});
</script>

<Environment files={'spaichingen_hill_1k.hdr'} />

<Grid
	position.y={0.1}
	cellColor="#ffaa00"
	sectionColor="#00000"
	sectionThickness={0}
	fadeDistance={40}
	cellSize={1}
	gridSize={[200, 200]}
/>

<World>
	<GameWorld>
		<Player />
		<AutoColliders>
			<T.Mesh>
				<T.BoxGeometry args={[100, 0.05, 100]} />
				<T.MeshStandardMaterial color="#121212" transparent opacity={0} />
			</T.Mesh>
			<T.Mesh position.x={20} position.z={-50} position.y={2}>
				<T.BoxGeometry args={[4, 4, 4]} />
				<T.MeshStandardMaterial color="#444444" />
			</T.Mesh>
		</AutoColliders>

		<AutoColliders>
			<T.Mesh position.z={-25} position.y={2}>
				<T.BoxGeometry args={[4, 4, 4]} />
				<T.MeshStandardMaterial color="#444444" wireframe />
			</T.Mesh>
		</AutoColliders>

		{#each { length: 10 } as d, x}
			{#each { length: 10 } as rz, z}
				<AutoColliders restitution={0}>
					<T.Mesh position.x={(x - 5) * 20 + 3} position.z={(z - 5) * 50 + 5} position.y={2}>
						<T.BoxGeometry args={[4, 4, 4]} />
						<T.MeshStandardMaterial color="#444444" wireframe />
					</T.Mesh>
				</AutoColliders>
			{/each}
		{/each}

		<!-- <Wall scale={0.01} position={[0, 0, -6]} rotation.y={DEG2RAD * -10} /> -->

		{#if true}
			<Debug depthTest={true} depthWrite={true} side={DoubleSide} />
		{/if}
	</GameWorld>
</World>
