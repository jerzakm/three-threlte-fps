<script lang="ts">
	import { useKeyboardControls } from 'svelte-kbc';
	import { debugStores } from './debugStores';
	import { Sheet, Studio, SheetObject } from '@threlte/theatre';
	import { Debug } from '@threlte/rapier';

	const { debugActive } = debugStores;
	const { debugToggle } = useKeyboardControls();

	const debugOff = () => {};

	const debugOn = () => {};

	$: $debugActive ? debugOn() : debugOff();

	$: $debugToggle ? debugActive.set(!$debugActive) : '';
</script>

<Studio enabled={$debugActive} />

<SheetObject key="rapier" let:Declare>
	<Declare props={{ wireframe: false }} let:values>
		{#if values.wireframe && $debugActive}
			<Debug />
		{/if}
	</Declare>
</SheetObject>
