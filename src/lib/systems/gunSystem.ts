import { useGameData } from './_gameData';

export const initGunSystem = () => {
	const gameData = useGameData();

	const setGunOrientation = (theta = 0, phi = 0) => {
		gameData.gunData.orientation.theta = theta;
		gameData.gunData.orientation.phi = phi;
	};

	const update = () => {
		//
	};

	return { update, setGunOrientation };
};

export type GunSystem = ReturnType<typeof initGunSystem>;
