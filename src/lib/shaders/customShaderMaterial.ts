import type CustomShaderMaterial from 'three-custom-shader-material/vanilla';

let csmModule: typeof CustomShaderMaterial | undefined;

export const customShaderMaterial = async () => {
	if (!csmModule) {
		const csmVanilla = await import('three-custom-shader-material/vanilla');
		csmModule = csmVanilla.default;
	}

	return csmModule;
};
