<script lang="ts">
	import { Canvas } from '@threlte/core';

	import Scene from '$lib/Scene.svelte';
	import { KeyboardControls, wasdConfig } from 'svelte-kbc';
</script>

<KeyboardControls config={wasdConfig()}>
	<Canvas>
		<Scene />
	</Canvas>
</KeyboardControls>
