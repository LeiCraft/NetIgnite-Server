<script setup lang="ts">
import DashboardPage from '@/components/DashboardPage.vue';
import { Device } from '@/utils/models/device';
import FormDescription from '~/components/forms/FormDescription.vue';
import FormGroup from '~/components/forms/FormGroup.vue';
import FormInput from '~/components/forms/FormInput.vue';
import FormLabel from '~/components/forms/FormLabel.vue';
import FormSelect from '~/components/forms/FormSelect.vue';
import FormSubmitBtn from '~/components/forms/FormSubmitBtn.vue';
import FormTextarea from '~/components/forms/FormTextarea.vue';
import { useAPI } from '~/composables/useAPI';
import type { NotificationToastSettings } from '~/composables/useNotificationToast';
import { Agent } from '~/utils/models/agent';
import { SessionStore } from '~/utils/userStore';

definePageMeta({
	layout: 'dashboard',
	middleware: 'auth',
});


const route = useRoute();
const device_id = route.params.id;

const isNewDevice = device_id === "new";

const initialNotification = ref<NotificationToastSettings | null>(null);

async function getDevice() {

    if (isNewDevice) {
        return new Device({
            id: -1,
            name: "",
            description: "",
            type: "" as any,
            macAddress: "",
            port: 9,
            agentID: -1,
            ownerID: SessionStore.useUserInfo().userID,
            status: 'unknown',
        });
    }

    const response = await useAPI(`/api/devices/${device_id}` as `/api/devices/:id`, {
        method: 'GET'
    });
        
    if (response.status !== "OK" || !response.data) {
        initialNotification.value = {
            message: `Error fetching device: ${response?.message || 'unknown error'}`,
            type: 'error'
        };
        return {} as Device;
    }
    return new Device({
        ...response.data,
        status: 'unknown',
    });
}

async function getAgents() {

    const response = await useAPI("/api/agents", {
        method: 'GET'
    });
        
    if (response.status !== "OK" || !response.data) {
        initialNotification.value = {
            message: `Error fetching agent: ${response?.message || 'unknown error'}`,
            type: 'error'
        };
        await navigateTo('/404', { redirectCode: 404 });
        return [];
    }

    return response.data.map((agentData) => new Agent({
        ...agentData,
        status: 'unknown'
    }));

}

const device = reactive(await getDevice());
const agents = await getAgents();

async function sumbitForm() {

    try {

        if (isNewDevice) {
            const response = await useAPI('/api/devices', {
                method: 'POST',
                body: JSON.stringify(device)
            });

            if (response.status !== "OK" || !response.data) {
                useNotificationToast({
                    message: `Error creating device: ${response?.message || 'unknown error'}`,
                    type: 'error'
                });
                return;
            }
            useNotificationToast({
                message: 'Device created successfully',
                type: 'success'
            });
        } else {

            const response = await useAPI(`/api/devices/${device.id}`, {
                method: 'PUT',
                body: JSON.stringify(device)
            });

            if (response.status !== "OK") {
                useNotificationToast({
                    message: `Error updating device: ${response?.message || 'unknown error'}`,
                    type: 'error'
                });
                return;
            }
            useNotificationToast({
                message: 'Device updated successfully',
                type: 'success'
            });
        }

        navigateTo('/devices');

    } catch (error) {
        useNotificationToast({
            message: `Error: ${error instanceof Error ? error.message : 'unknown error'}`,
            type: 'error'
        });
    }

}

const isSubmitDisabled = computed(() => {
    return !device.name || !device.type || !device.macAddress || (device.port < 1 || device.port > 65535) || (device.agentID < 1);
});


onMounted(() => {
    if (initialNotification.value && import.meta.client) {
        useNotificationToast(initialNotification.value);
        navigateTo('/devices');
    }
});

</script>

<template>

    <DashboardPage v-if="!initialNotification" :title="isNewDevice ? 'Create New Device' : 'Edit Device'" subtitle="Manage your device details" image="bi bi-wifi">

        <form @submit.prevent="sumbitForm" autocomplete="off">

            <div class="box-container d-flex flex-column justify-content-center">

                <h4 class="text-white mb-4">Resource Details</h4>

                <div class="row">
                    <FormGroup class="col-md-6">
                        <FormLabel>Name</FormLabel>
                        <FormInput v-model="device.name" placeholder="Enter device name" required />
                        <FormDescription>
                            The name of the device. This is used to identify the device in the dashboard.
                        </FormDescription>
                    </FormGroup>
                    <FormGroup class="col-md-6">
                        <FormLabel>Device Type</FormLabel>
                        <FormSelect v-model="device.type" required>
                            <option value="" disabled>Select Device Type</option>
                            <option v-for="type in Device.Utils.getAllDeviceTypes()" :value="type.name">
                                {{ type.label }}
                            </option>
                        </FormSelect>
                    </FormGroup>
                    <FormGroup class="col-md-12">
                        <FormLabel>Description</FormLabel>
                        <FormTextarea rows="2" v-model="device.description" placeholder="Enter device description"></FormTextarea>
                    </FormGroup>
                </div>

            </div>

            <div class="box-container d-flex flex-column justify-content-center mt-4">

                <h4 class="text-white mb-4">Connection Details</h4>

                <div class="row mb-4">
                    <FormGroup class="col-md-6 row">
                        <div class="col-md-9">
                            <FormLabel>MAC Address</FormLabel>
                            <FormInput v-model="device.macAddress" placeholder="Enter MAC address" required />
                        </div>
                        <div class="col-md-3">
                            <FormLabel>Port</FormLabel>
                            <FormInput v-model.number="device.port" type="number" min="1" max="65535" placeholder="Port" required />
                        </div>
                    </FormGroup>
                    <FormGroup class="col-md-6">
                        <FormLabel>Agent ID</FormLabel>
                        <FormSelect v-model.number="device.agentID" required>
                            <option value="" disabled>Select Agent</option>
                            <option v-for="agent in agents" :value="agent.id">
                                {{ agent.name }}
                            </option>
                        </FormSelect>
                    </FormGroup>
                </div>

                <div class="d-flex justify-content-end">
                    <FormSubmitBtn class="btn btn-primary text-right" type="submit" :disabled="isSubmitDisabled">
                        {{ isNewDevice ? 'Create Device' : 'Update Device' }}
                    </FormSubmitBtn>
                </div>

            </div>

        </form>

    </DashboardPage>

</template>

<style scoped>

</style>
