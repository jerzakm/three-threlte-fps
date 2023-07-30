import { writable } from 'svelte/store';

const bulletCount = writable({
	current: 30,
	max: 30
});

export const uiStores = { bulletCount };
