<template>
	<div>
		<h1>Wake Up Device</h1>
		<button @click="wakeUpDevice">Wake Up</button>
		<p v-if="response">{{ response.message }}</p>
		<nuxt-link to="/test-websocket">Test Websocket</nuxt-link>
	</div>

</template>

<script setup lang="ts">

import { ref } from 'vue';

const response = ref(null);

async function wakeUpDevice() {
	try {
		const res = await $fetch('/api/device/123/wakeup', {
			method: 'POST',
			body: { customData: 'hello from client' },
		});
		response.value = res;
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
