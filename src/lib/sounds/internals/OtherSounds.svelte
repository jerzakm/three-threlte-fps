<script lang="ts">
	import { useGameData } from '$lib/systems/_gameData';
	import { T, useFrame } from '@threlte/core';
	import { PositionalAudio } from '@threlte/extras';

	import type * as THREE from 'three';

	let audioSources = new Array<THREE.PositionalAudio>(4);

	let shotIndex = 0;

	const { otherSounds } = useGameData().soundData;

	useFrame(() => {
		if (otherSounds.length > 0) {
			const sound = otherSounds.shift();
			shotIndex < audioSources.length - 1 ? shotIndex++ : (shotIndex = 0);
			if (!sound) return;
			audioSources[shotIndex].stop();
			const { x, y, z } = sound.origin;
			audioSources[shotIndex].parent?.position.set(x, y, z);

			audioSources[shotIndex].setVolume(sound.volume || 1);
			audioSources[shotIndex].setDirectionalCone(
				sound.coneInnerAngle || 120,
				sound.coneOuterAngle || 200,
				sound.coneOuterGain || 0.9
			);

			audioSources[shotIndex].play();
		}
	});
</script>

{#each audioSources as s, i}
	<T.Mesh>
		<PositionalAudio autostart src={'/audio/m4shot.mp3'} bind:ref={audioSources[i]} />
	</T.Mesh>
{/each}
