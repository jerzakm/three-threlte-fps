<script lang="ts">
	import { Canvas } from '@threlte/core';

	import GameWorld from '$lib/GameWorld.svelte';
	import { KeyboardControls, wasdConfig } from 'svelte-kbc';
	import Cameras from '$lib/renderer/Cameras.svelte';
	import Renderer from '$lib/renderer/Renderer.svelte';
	import GameUi from './ui/GameUi.svelte';
</script>

<GameUi />
<KeyboardControls config={wasdConfig()}>
	<Canvas colorManagementEnabled>
		<Cameras />
		<Renderer />
		<GameWorld />
	</Canvas>
</KeyboardControls>
