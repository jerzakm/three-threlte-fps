<script lang="ts">
	import { useKeyboardControls } from 'svelte-kbc';
	import { debugStores } from './debugStores';
	import { Studio, SheetObject } from '@threlte/theatre';
	import { Debug } from '@threlte/rapier';
	import { cameraStores } from '$lib/renderer/cameraStores';
	import { rendererStores } from '$lib/renderer/rendererStores';
	import DebugCamera from './_DebugCamera.svelte';

	const cs = cameraStores;
	const { activeCamera } = rendererStores;

	export let debugCamera = false;

	const { debugActive } = debugStores;
	const { debugToggle } = useKeyboardControls();

	const debugOff = () => {};
	const debugOn = () => {};

	$: $debugActive ? debugOn() : debugOff();
	$: $debugActive && debugCamera ? activeCamera.set('debug') : activeCamera.set('eyes');

	$: $debugToggle ? debugActive.set(!$debugActive) : '';

	$: console.log($debugActive);
</script>

<Studio hide={!$debugActive} />

<SheetObject key="rapier" let:Declare>
	<Declare props={{ wireframe: false }} let:values>
		{#if values.wireframe && $debugActive}
			<Debug />
		{/if}
	</Declare>
</SheetObject>

<SheetObject key="debugCamera" let:Declare>
	<Declare props={{ active: false }} let:values>
		{#if values.active && $debugActive}
			<DebugCamera />
		{/if}
	</Declare>
</SheetObject>
