<script lang="ts">
	import { T } from '@threlte/core';
	import { Environment, Grid } from '@threlte/extras';

	import Player from '$lib/player/Player.svelte';
	import { AutoColliders, Debug, World } from '@threlte/rapier';
	import { AmbientLight, DoubleSide, HemisphereLight } from 'three';
	import { onMount } from 'svelte';
	import { rendererStores } from './renderer/rendererStores';
	import GameSystems from './GameSystems.svelte';
	import { Sheet, SheetObject } from '@threlte/theatre';
	import { debugStores } from './debug/debugStores';
	import DebugGame from './debug/DebugGame.svelte';
	import GunSystem from './gun/GunSystem.svelte';

	const { activeCamera } = rendererStores;

	const { debugActive } = debugStores;

	onMount(() => {
		// activeCamera.set('debug');
		// activeCamera.set('eyes');
		// activeCamera.set('sights');
	});
</script>

<Environment files={'spaichingen_hill_1k.hdr'} />

<Grid
	position.y={0.11}
	cellColor="#ffaa00"
	sectionColor="#000000"
	sectionThickness={0}
	cellSize={1}
	gridSize={[200, 200]}
	frustumCulled={false}
/>

<T.AmbientLight intensity={0.4} />

<T.HemisphereLight color={'white'} intensity={0.1} />

<World>
	<GameSystems>
		<Player />
		<GunSystem />
		<AutoColliders>
			<T.Mesh>
				<T.BoxGeometry args={[100, 0.05, 100]} />
				<T.MeshStandardMaterial color="#121212" />
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
				<AutoColliders restitution={0}>
					<T.Mesh position.x={(x - 5) * 20 + 3} position.z={(z - 5) * 50 + 5} position.y={2}>
						<T.BoxGeometry args={[4, 4, 4]} />
						<T.MeshStandardMaterial color="#444444" />
					</T.Mesh>
				</AutoColliders>
			{/each}
		{/each}
		<DebugGame />
	</GameSystems>
</World>
