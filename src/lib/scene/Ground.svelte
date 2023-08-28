<script lang="ts">
	import { createNoise2D } from 'simplex-noise';
	import { T, useLoader } from '@threlte/core';
	import { AutoColliders, Collider, RigidBody } from '@threlte/rapier';
	import { PlaneGeometry } from 'three';
	import { DEG2RAD } from 'three/src/math/MathUtils';
	import { useTexture } from '@threlte/extras';
	import RAPIER from '@dimforge/rapier3d-compat';

	const size = 100;
	let nsubdivs = 80;
	let heights: any[] = [];

	const geometry = new PlaneGeometry(size, size, nsubdivs, nsubdivs);
	const noise = createNoise2D();
	const vertices = geometry.getAttribute('position').array;

	for (let x = 0; x <= nsubdivs; x++) {
		for (let y = 0; y <= nsubdivs; y++) {
			let height = noise(x / 40, y / 40) * 5 + noise(x / 80, y / 80) * 7 + noise(x / 10, y / 10);

			const vertIndex = (x + (nsubdivs + 1) * y) * 3;
			//@ts-ignore
			vertices[vertIndex + 2] = height;
			const heightIndex = y + (nsubdivs + 1) * x;
			heights[heightIndex] = height;
		}
	}

	// needed for lighting
	geometry.computeVertexNormals();

	const scale = new RAPIER.Vector3(size, 1, size);
</script>

<!-- <T.Group position.y={-5}>
	<T.Mesh {geometry} rotation.x={DEG2RAD * -90}>
		<T.MeshStandardMaterial color="#ffffff" />
	</T.Mesh>

	<RigidBody type={'fixed'}>
		<Collider shape={'heightfield'} args={[nsubdivs, nsubdivs, heights, scale]} />
	</RigidBody>
</T.Group> -->

<T.Group position.y={-3}>
	<AutoColliders>
		<T.Mesh rotation.x={-DEG2RAD * 90}>
			<T.PlaneGeometry args={[1000, 1000]} />
			<T.MeshStandardMaterial color="#aaaaaa" />
		</T.Mesh>
	</AutoColliders>
</T.Group>
