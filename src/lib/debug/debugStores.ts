import { dev } from '$app/environment';
import { writable } from 'svelte/store';

const debugActive = writable(dev);

export const debugStores = {
	debugActive
};
