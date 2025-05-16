<template>

	<div class="mt-auto mb-auto ms-auto me-auto">
		<h1>Wake Up Device</h1>
		<input v-model="macAddress" placeholder="Enter MAC address" class="form-control form-input" type="text" >
		<button @click="wakeUpDevice" class="btn btn-success mt-2">Wake Up</button>
		<p v-if="response">{{ (response as any).message }}</p>
		<!-- <TestWebsocket class="mt-5"></TestWebsocket> -->
	</div>

</template>

<script setup lang="ts">

definePageMeta({
    middleware: 'auth',
    meta: {
        title: 'Dashboard | NetIgnite',
        description: 'Dashboard page',
    }
})

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

<style scoped>

@import '/assets/forms.css';

</style>

