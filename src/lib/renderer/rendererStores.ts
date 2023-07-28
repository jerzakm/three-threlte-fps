import { writable, type Writable } from 'svelte/store';
import { type PerspectiveCamera, Quaternion, Vector3 } from 'three';

export type CameraViewLocation = 'eyes' | 'sights' | 'debug';

const activeCamera: Writable<CameraViewLocation> = writable('eyes');

const eyesCamera: Writable<PerspectiveCamera | undefined> = writable(undefined);
const sightsCamera: Writable<PerspectiveCamera | undefined> = writable(undefined);
const debugCamera: Writable<PerspectiveCamera | undefined> = writable(undefined);
const eyesPosition: Writable<Vector3> = writable(new Vector3());
const eyesQuat: Writable<Quaternion> = writable(new Quaternion());

export const rendererStores = {
	activeCamera,
	eyesCamera,
	sightsCamera,
	debugCamera,
	eyesPosition,
	eyesQuat
};
