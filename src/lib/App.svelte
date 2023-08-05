<script lang="ts">
	import { Canvas } from '@threlte/core';

	import GameWorld from '$lib/GameWorld.svelte';
	import Cameras from '$lib/renderer/Cameras.svelte';
	import Renderer from '$lib/renderer/Renderer.svelte';
	import { Theatre } from '@threlte/theatre';
	import { KeyboardControls } from 'svelte-kbc';
	import GameUi from './ui/GameUi.svelte';

	const config = [
		// individual key presses

		{ name: 'debugToggle', keys: ['y', 'Y'] },
		{ name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
		{ name: 'back', keys: ['ArrowDown', 's', 'S'] },
		{ name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
		{ name: 'right', keys: ['ArrowRight', 'd', 'D'] },
		{ name: 'run', keys: ['Shift'] },
		{ name: 'scopeToggle', keys: ['t', 'T'] },
		{ name: 'reload', keys: ['r', 'R'] },
		{ name: 'leanLeft', keys: ['q', 'Q'] },
		{ name: 'leanRight', keys: ['e', 'E'] }
	];
</script>

<GameUi />
<KeyboardControls {config}>
	<Canvas
		colorManagementEnabled
		rendererParameters={{
			precision: 'highp',
			antialias: true,
			logarithmicDepthBuffer: true,
			powerPreference: 'high-performance'
		}}
	>
		<Theatre>
			<Cameras />
			<Renderer />
			<GameWorld />
		</Theatre>
	</Canvas>
</KeyboardControls>
