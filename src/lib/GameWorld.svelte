<script lang="ts">
	import BulletSystem from '$lib/systems/BulletSystem.svelte';
	import { setContext } from 'svelte';
	import type { GameSystems } from '$lib/systems/gameSystems';
	import { initBulletSystem } from './systems/bulletSystem';

	const systems: GameSystems = {
		bulletSystem: initBulletSystem()
	};

	setContext<GameSystems>('gameSystems', systems);
</script>

<slot />

<BulletSystem />
