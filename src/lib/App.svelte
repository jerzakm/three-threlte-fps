<script lang="ts">
	import { Canvas } from '@threlte/core';

	import Scene from '$lib/Scene.svelte';
	import { KeyboardControls, wasdConfig } from 'svelte-kbc';
	import Cameras from '$lib/renderer/Cameras.svelte';
	import Renderer from '$lib/renderer/Renderer.svelte';
</script>

<KeyboardControls config={wasdConfig()}>
	<Canvas>
		<Cameras />
		<Renderer />
		<Scene />
	</Canvas>
</KeyboardControls>
