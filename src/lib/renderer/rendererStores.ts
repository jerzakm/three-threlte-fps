import { writable, type Writable } from 'svelte/store';
import type { WebGLRenderTarget, PerspectiveCamera } from 'three';

export type CameraViewLocation = 'eyes' | 'sights' | 'debug';

const activeCamera: Writable<CameraViewLocation> = writable('eyes');

const eyesCamera: Writable<PerspectiveCamera | undefined> = writable(undefined);
const sightsCamera: Writable<PerspectiveCamera | undefined> = writable(undefined);
const debugCamera: Writable<PerspectiveCamera | undefined> = writable(undefined);
const sightsRenderTarget: Writable<WebGLRenderTarget | undefined> = writable(undefined);

export const rendererStores = {
	activeCamera,
	eyesCamera,
	sightsCamera,
	debugCamera,
	sightsRenderTarget
};
