import { useGameData } from './_gameData';

export const initGunSystem = () => {
	const gameData = useGameData();

	const update = () => {
		//
	};

	return { update };
};

export type GunSystem = ReturnType<typeof initGunSystem>;
