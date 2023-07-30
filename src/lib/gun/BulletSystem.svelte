<script lang="ts">
	import * as THREE from 'three';
	import { Group } from 'three';
	import {
		T,
		type Props,
		type Events,
		type Slots,
		forwardEventHandlers,
		useFrame
	} from '@threlte/core';
	import { useGltf, InstancedMeshes, InstancedMesh, Instance } from '@threlte/extras';
	import { useGameData } from '$lib/systems/_gameData';
	import type { V3 } from '$lib/util/types';

	let bulletPositions: {
		position: V3;
	}[] = new Array(100).fill({
		position: [0, 0, 0]
	});

	const gameData = useGameData();

	useFrame(() => {
		let c = 0;

		for (const bullet of gameData.bulletData.bulletPhysics) {
			if (bullet && c < 100) {
				const { x, y, z } = bullet.body.translation();
				bulletPositions[c] = {
					position: [x, y, z]
				};
				c++;
			}
		}
	});

	const bulletSize = 0.05;
</script>

<InstancedMesh limit={100} frustumCulled={false}>
	<T.BoxGeometry args={[bulletSize, bulletSize, bulletSize]} />
	<T.MeshStandardMaterial side={THREE.DoubleSide} />

	{#each bulletPositions as b, i}
		<Instance position={b.position} />
	{/each}
</InstancedMesh>
