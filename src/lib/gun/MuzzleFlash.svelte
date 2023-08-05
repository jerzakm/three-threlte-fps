<script lang="ts">
	import { T } from '@threlte/core';
	import { gunStores } from './gunStores';

	const { flashIntensity, barrelStart, barrelEnd } = gunStores;
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
