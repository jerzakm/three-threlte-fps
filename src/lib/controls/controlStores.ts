import { writable } from 'svelte/store';

const allowPointerLock = writable(true);
const allowMouseAim = writable(true);
const allowAds = writable(true);

export const controlStores = { allowPointerLock, allowMouseAim, allowAds };
