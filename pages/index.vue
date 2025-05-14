<template>

	<div>
		<h1>Wake Up Device</h1>
		<input v-model="macAddress" placeholder="Enter MAC address" />
		<button @click="wakeUpDevice">Wake Up</button>
		<p v-if="response">{{ (response as any).message }}</p>
		<!-- <TestWebsocket class="mt-5"></TestWebsocket> -->
	</div>

</template>

<script setup lang="ts">
import { ref } from 'vue';
// import TestWebsocket from '~/components/test-websocket.vue';

const response = ref(null);
const macAddress = ref(''); // Reactive variable for MAC address

async function wakeUpDevice() {
	if (!macAddress.value) {
		console.error('MAC address is required');
		return;
	}
	try {
		const res = await $fetch('/api/device/1/wakeup', {
			method: 'POST',
			body: {
				macAddress: macAddress.value, // Use the inputted MAC address
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
