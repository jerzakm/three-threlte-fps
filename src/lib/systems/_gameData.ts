import { getContext } from 'svelte';
import type { BulletPhysics, BulletImpact } from './bulletSystem';
import type { GameSound } from './soundSystem';

const bulletData: {
	bulletPhysics: BulletPhysics[];
	bulletImpacts: BulletImpact[];
} = {
	bulletPhysics: [],
	bulletImpacts: []
};

const soundData: {
	impactSounds: GameSound[];
} = {
	impactSounds: []
};

export const gameData = {
	bulletData,
	soundData
};

export type GameData = typeof gameData;

export const useGameData = () => {
	return getContext<GameData>('game-data-ctx');
};
