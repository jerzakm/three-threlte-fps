<script lang="ts">
	import { T } from '@threlte/core';
	import { Environment } from '@threlte/extras';

	import Player from '$lib/player/Player.svelte';
	import { AutoColliders, World } from '@threlte/rapier';
	import { onMount } from 'svelte';
	import { DEG2RAD } from 'three/src/math/MathUtils';
	import GameSystems from './GameSystems.svelte';
	import DebugGame from './debug/DebugGame.svelte';
	import { debugStores } from './debug/debugStores';
	import GunSystem from './gun/GunSystem.svelte';
	import { rendererStores } from './renderer/rendererStores';
</script>

<Environment files={'spaichingen_hill_1k.hdr'} />

<T.AmbientLight intensity={0.4} />

<T.HemisphereLight color={'white'} intensity={0.1} />

<World>
	<GameSystems>
		<Player />
		<GunSystem />
		<AutoColliders>
			<T.Mesh rotation.x={-DEG2RAD * 90}>
				<T.PlaneGeometry args={[1000, 1000]} />
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
