<script lang="ts">
	import { uiStores } from './uiStores';

	const { bulletCount } = uiStores;
</script>

<div
	class="w-screen h-screen fixed top-0 left-0 z-50 pointer-events-none grid grid-rows-6 text-lg text-white"
>
	<div>
		<!--  -->
	</div>
	<div>
		<!--  -->
	</div>
	<div>
		<!--  -->
	</div>
	<div>
		<!--  -->
	</div>
	<div>
		<!--  -->
	</div>
	<div class="flex items-end justify-end pb-4">
		<!--  -->
		<div class="flex pr-10 items-center">
			{#each { length: 30 } as a, x}
				<!-- <img src="/ui/ammoOutlined.svg" class="h-16 -mx-6" alt="bullet" /> -->
			{/each}
			<!-- <span class="ammoCount text-4xl">{$bulletCount.current}/{$bulletCount.max}</span> -->
			<ul class="ammoCount text-lg flex gap-10">
				<li class="text-yellow-400">LMB - shoot</li>
				<li class="text-yellow-400">RMB - Ads</li>
				<li class="text-yellow-400">R - reload</li>
				<li class="text-yellow-400">T - scope swap</li>
				<li class="text-yellow-400">Mousewheel - scope adjustment</li>
				<li class="text-green-400">Y - debug</li>
			</ul>
		</div>
	</div>
</div>

<style>
	.ammoCount {
		text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
	}
</style>
