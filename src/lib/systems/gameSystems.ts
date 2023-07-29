import { getContext } from 'svelte';
import type { initBulletSystem } from './bulletSystem';

export const useSystem = () => {
	return getContext<GameSystems>('gameSystems');
};

export type GameSystems = {
	bulletSystem?: ReturnType<typeof initBulletSystem>;
};
