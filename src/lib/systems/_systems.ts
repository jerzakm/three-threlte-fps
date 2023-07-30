import { getContext } from 'svelte';
import type { BulletSystem } from './bulletSystem';
import type { SoundSystem } from './soundSystem';
import type { GunSystem } from './gunSystem';

export type GameSystems = {
	bulletSystem: BulletSystem;
	soundSystem: SoundSystem;
	gunSystem: GunSystem;
};

export const useSystem = () => {
	return getContext<GameSystems>('game-systems-ctx');
};
