<template>
	<div>
		<h1>Wake Up Device</h1>
		<button @click="wakeUpDevice">Wake Up</button>
		<p v-if="response">{{ (response as any).message }}</p>
		<!-- <TestWebsocket class="mt-5"></TestWebsocket> -->
	</div>

</template>

<script setup lang="ts">

import { ref } from 'vue';
import TestWebsocket from '~/components/test-websocket.vue';

const response = ref(null);

async function wakeUpDevice() {
	try {
		const res = await $fetch('/api/device/1/wakeup', {
			method: 'POST',
			body: {
				macAddress: '00-11-22-33-44-55',
			},
		});
		(response as any).value = res;
	} catch (err) {
		console.error('Error:', err);
	}
}

</script>

<style>
.turn-on-button {
	background-color: #4CAF50;
	border: none;
	color: white;
	padding: 16px 40px;
	text-decoration: none;
	font-size: 30px;
	margin: 2px;
	cursor: pointer;
}
</style>
