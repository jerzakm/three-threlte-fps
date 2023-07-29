import { writable, type Writable } from 'svelte/store';
import { type PerspectiveCamera, Quaternion, Vector3 } from 'three';

export type CameraViewLocation = 'eyes' | 'sights' | 'debug';

const sightsPosition: Writable<Vector3> = writable(new Vector3());

const sightsPosition2: Writable<Vector3> = writable(new Vector3());
const sightsQuat: Writable<Quaternion> = writable(new Quaternion());

const eyesPosition: Writable<Vector3> = writable(new Vector3());
const eyesQuat: Writable<Quaternion> = writable(new Quaternion());

export const cameraStores = {
	sightsPosition,
	sightsQuat,
	eyesPosition,
	eyesQuat,
	sightsPosition2
};
