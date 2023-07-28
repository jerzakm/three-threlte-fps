import { writable } from 'svelte/store';

const playerPosition = writable({
	x: 0,
	y: 0,
	z: 0
});

export const playerStores = { playerPosition };
