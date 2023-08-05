<script lang="ts">
	import { useFrame } from '@threlte/core';
	import { initBulletSystem } from '$lib/systems/bulletSystem';
	import { initSoundSystem } from '$lib/systems/soundSystem';
	import { setContext } from 'svelte';
	import { gameData } from '$lib/systems/_gameData';
	import SoundSystem from '$lib/sounds/SoundSystem.svelte';
	import BulletSystem from '$lib/gun/BulletSystem.svelte';
	import type { GameSystems } from './systems/_systems';
	import { initGunSystem } from './systems/gunSystem';
	import ControlsSystem from '$lib/controls/ControlsSystem.svelte';

	setContext('game-data-ctx', gameData);

	const systems: GameSystems = {
		bulletSystem: initBulletSystem(),
		soundSystem: initSoundSystem(),
		gunSystem: initGunSystem()
	};

	setContext<GameSystems>('game-systems-ctx', systems);

	useFrame(() => {
		systems.bulletSystem.update();
		systems.bulletSystem.cleanup();
		systems.soundSystem.update();
	});
</script>

<SoundSystem />
<BulletSystem />
<ControlsSystem />
<slot />
