import { writable } from 'svelte/store';

const debugActive = writable(false);

export const debugStores = {
	debugActive
};
