<script lang="ts">
	import { T } from '@threlte/core';
	import { DoubleSide, MeshStandardMaterial, SphereGeometry } from 'three';
</script>

<T.Mesh>
	<T.SphereGeometry args={[2000]} />
	<T.MeshStandardMaterial
		color="#99ccff"
		side={DoubleSide}
		envMapIntensity={2}
		opacity={0.7}
		transparent
	/>
</T.Mesh>
