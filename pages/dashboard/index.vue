<template>

	<div class="mt-auto mb-auto ms-auto me-auto">
		<h1>Wake Up Device</h1>
		<form @submit.prevent="wakeUpDevice">
			<input v-model="macAddress" placeholder="Enter MAC address" class="form-control form-input mb-2" type="text">
			<input v-model="agentID" placeholder="Enter Agent ID" class="form-control form-input mb-2" type="text">
			<button class="btn btn-success mb-2">Wake Up</button>
		</form>
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
const agentID = ref(''); // Reactive variable for Agent ID

async function wakeUpDevice() {
	if (!macAddress.value) {
		console.error('MAC address is required');
		return;
	}
	try {
		const res = await $fetch(`/api/user/device/${agentID.value}/wakeup`, {
			method: 'POST',
			body: {
				macAddress: macAddress.value, // Use the inputted MAC address
			},
		});
		macAddress.value = ''; // Clear the input field after submission
		agentID.value = ''; // Clear the input field after submission

		(response as any).value = res;
	} catch (err) {
		console.error('Error:', err);
	}
}
</script>

<style scoped>

@import '/assets/forms.css';

</style>

