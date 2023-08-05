import { useGameData } from './_gameData';

export const initControlsSystem = () => {
	const gameData = useGameData();

	const mouseMove = (x: number, y: number) => {
		gameData.controlsData.mouse.moveX += x;
		gameData.controlsData.mouse.moveY += y;
	};

	const clearMouseMove = () => {
		gameData.controlsData.mouse.moveX = 0;
		gameData.controlsData.mouse.moveY = 0;
	};

	const update = () => {
		//
	};

	return { update, mouseMove, clearMouseMove };
};

export type ControlsSystem = ReturnType<typeof initControlsSystem>;
