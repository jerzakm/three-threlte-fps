import type { V3, V3obj } from '$lib/util/types';
import { useGameData } from './_gameData';

export const soundMap = {
	impactDefault: '/audio/impact2.mp3',
	shot: '/audio/m4shot.mp3'
};

export type GameSound = {
	origin: V3obj;
	sound: string;
	coneInnerAngle?: number;
	coneOuterAngle?: number;
	coneOuterGain?: number;
	roloff?: number;
	volume?: number;
};

export const initSoundSystem = () => {
	const gameData = useGameData();

	const makeSound = (options: GameSound) => {
		gameData.soundData.otherSounds.push(options);
	};

	const update = () => {
		for (const impact of gameData.bulletData.bulletImpacts) {
			if (!impact.playedSound) {
				impact.playedSound = true;

				gameData.soundData.impactSounds.push({
					origin: impact.position,
					sound: impact.sound
				});
			}
		}
	};

	return { makeSound, update };
};

export type SoundSystem = ReturnType<typeof initSoundSystem>;
