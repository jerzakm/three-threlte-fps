<script lang="ts">
	import { customShaderMaterial } from '$lib/shaders/customShaderMaterial';
	import { T } from '@threlte/core';

	import { rendererStores } from '$lib/renderer/rendererStores';
	import { useTexture } from '@threlte/extras';
	import { MeshBasicMaterial } from 'three';

	import vertexShader from '$lib/shaders/vertStandard.glsl?raw';
	import fragmentShader from '$lib/shaders/fragScopeX2.glsl?raw';

	const { sightsRenderTarget } = rendererStores;
	const reticleSprite = useTexture('/sprites/eotechHolo.png');

	let material: any;

	$: $sightsRenderTarget && $reticleSprite && initializeMaterial();

	const initializeMaterial = async () => {
		const csm = await customShaderMaterial();
		if ($sightsRenderTarget && $reticleSprite && csm) {
			// x2material.needsUpdate = true;
			material = new csm({
				baseMaterial: MeshBasicMaterial,
				map: $sightsRenderTarget.texture,

				uniforms: {
					sight: { value: $reticleSprite },
					scene: { value: $sightsRenderTarget.texture }
				},
				vertexShader,
				fragmentShader
			});
		}
	};
</script>

{#if material}
	<T is={material} />
{/if}
