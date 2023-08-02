<script lang="ts">
	import { Canvas } from '@threlte/core';

	import GameWorld from '$lib/GameWorld.svelte';
	import { KeyboardControls, wasdConfig } from 'svelte-kbc';
	import Cameras from '$lib/renderer/Cameras.svelte';
	import Renderer from '$lib/renderer/Renderer.svelte';
	import GameUi from './ui/GameUi.svelte';
	import DebugGame from './debug/DebugGame.svelte';
	import { Sheet, SheetObject, Theatre } from '@threlte/theatre';

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
	<Canvas colorManagementEnabled>
		<Theatre>
			<Cameras />
			<Renderer />
			<GameWorld />
		</Theatre>
	</Canvas>
</KeyboardControls>
