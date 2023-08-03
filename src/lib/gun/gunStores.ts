import { writable, type Writable } from 'svelte/store';
import type { Object3D } from 'three';

const gunObject3D: Writable<Object3D | undefined> = writable(undefined);

export const gunStores = {
	gunObject3D
};
