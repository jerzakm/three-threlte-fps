import { tweened } from 'svelte/motion';
import { writable, type Writable } from 'svelte/store';
import { Vector3, type Object3D } from 'three';

const gunObject3D: Writable<Object3D | undefined> = writable(undefined);
const barrelStart: Writable<Vector3> = writable(new Vector3());
const barrelEnd: Writable<Vector3> = writable(new Vector3());
const flashIntensity = tweened(0);
const shotPulse = writable(false);

export const gunStores = {
	gunObject3D,
	barrelStart,
	barrelEnd,
	flashIntensity,
	shotPulse
};
