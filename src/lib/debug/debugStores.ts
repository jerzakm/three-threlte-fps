import { writable } from 'svelte/store';

const debugActive = writable(true);

export const debugStores = {
	debugActive
};
