import { getContext } from 'svelte';
import type { BulletPhysics, BulletImpact } from './bulletSystem';
import type { GameSound } from './soundSystem';
import { tweened } from 'svelte/motion';

const bulletData: {
	bulletPhysics: (BulletPhysics | undefined)[];
	bulletImpacts: BulletImpact[];
} = {
	bulletPhysics: [],
	bulletImpacts: []
};

const soundData: {
	impactSounds: GameSound[];
	otherSounds: GameSound[];
} = {
	impactSounds: [],
	otherSounds: []
};

const gunData = {
	orientation: {
		theta: 0,
		phi: 0
	},
	recoil: tweened({ x: 0, y: 0 })
};
export const gameData = {
	bulletData,
	soundData,
	gunData
};

export type GameData = typeof gameData;

export const useGameData = () => {
	return getContext<GameData>('game-data-ctx');
};
