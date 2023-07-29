import { getContext } from 'svelte';
import type { BulletSystem } from './bulletSystem';
import type { SoundSystem } from './soundSystem';

export type GameSystems = {
	bulletSystem: BulletSystem;
	soundSystem: SoundSystem;
};

export const useSystem = () => {
	return getContext<GameSystems>('game-systems-ctx');
};
