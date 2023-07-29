<script lang="ts">
	import { useFrame } from '@threlte/core';
	import { initBulletSystem } from '$lib/systems/bulletSystem';
	import { initSoundSystem } from '$lib/systems/soundSystem';
	import { setContext } from 'svelte';
	import { gameData } from '$lib/systems/_gameData';
	import SoundSystem from '$lib/sounds/SoundSystem.svelte';

	setContext('game-data-ctx', gameData);

	const systems = {
		bulletSystem: initBulletSystem(),
		soundSystem: initSoundSystem()
	};

	setContext('game-systems-ctx', systems);

	useFrame(() => {
		systems.bulletSystem.update();
		systems.bulletSystem.cleanup();
		systems.soundSystem.update();
	});
</script>

<SoundSystem />
<slot />
