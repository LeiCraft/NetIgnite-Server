<script setup lang="ts">
import DashboardPage from '@/components/DashboardPage.vue';
import { Device } from '@/utils/models/device';
import FormDescription from '~/components/forms/FormDescription.vue';
import FormGroup from '~/components/forms/FormGroup.vue';
import FormInput from '~/components/forms/FormInput.vue';
import FormLabel from '~/components/forms/FormLabel.vue';
import FormPWInput from '~/components/forms/FormPWInput.vue';
import FormSelect from '~/components/forms/FormSelect.vue';
import FormSubmitBtn from '~/components/forms/FormSubmitBtn.vue';
import FormTextarea from '~/components/forms/FormTextarea.vue';
import { SessionStore } from '~/utils/userStore';

definePageMeta({
	layout: 'dashboard',
	middleware: 'auth',
});


const route = useRoute();
const device_id = route.params.id;

const isNewDevice = device_id === "new";

async function getDevice() {

    if (isNewDevice) {
        return new Device({
            id: -1,
            name: "",
            description: "",
            type: "" as any,
            secret: crypto.randomUUID().replace(/-/g, '').substring(0, 16),
            ownerID: SessionStore.useUserInfo().userID,
            status: 'unknown',
        });
    }

    const { data } = await useFetch(`/api/devices/${device_id}` as `/api/devices/:id`, {
        method: 'GET'
    });
    const response = data.value;
        
    if (!response || response.status !== "OK" || !response.data) {
        useNotificationToast({
            message: `Error fetching device: ${response?.message || 'unknown error'}`,
            type: 'error'
        });
        return null as any as Device;
    }
    return new Device({
        ...response.data,
        status: 'unknown',
    });
}

const device = reactive(await getDevice());

async function sumbitForm() {

    try {

        if (isNewDevice) {
            const response = await $fetch('/api/devices', {
                method: 'POST',
                body: JSON.stringify(device)
            });

            if (!response || response.status !== "OK" || !response.data) {
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
            navigateTo(`/devices/${response.data}`, { replace: true });

        } else {

            const { data } = await useFetch(`/api/devices/${device.id}`, {
                method: 'PUT',
                body: JSON.stringify(device)
            });
            const response = data.value;

            if (!response || response.status !== "OK") {
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
            navigateTo(`/devices/`);
        }

    } catch (error) {
        useNotificationToast({
            message: `Error: ${error instanceof Error ? error.message : 'unknown error'}`,
            type: 'error'
        });
    }

}

const isSubmitDisabled = computed(() => {
    return !device.name || !device.type || !device.secret;
});

</script>

<template>

    <DashboardPage :title="isNewDevice ? 'Create New Device' : 'Edit Device'" subtitle="Manage your device details" image="bi bi-wifi">

        <form @submit.prevent="sumbitForm" autocomplete="off">

            <div class="box-container d-flex flex-column justify-content-center">

                <h4 class="text-white mb-4">Resource Details</h4>

                <div class="row">
                    <FormGroup class="col-md-6">
                        <FormLabel for="deviceName">Name</FormLabel>
                        <FormInput id="deviceName" v-model="device.name" placeholder="Enter device name" required />
                        <FormDescription>
                            The name of the device. This is used to identify the device in the dashboard.
                        </FormDescription>
                    </FormGroup>
                    <FormGroup class="col-md-6">
                        <FormLabel class="form-label">Device Type</FormLabel>
                        <FormSelect v-model="device.type" required>
                            <option value="" disabled>Select Device Type</option>
                            <option v-for="type in Device.Utils.getAllDeviceTypes()" :value="type.name">
                                {{ type.label }}
                            </option>
                        </FormSelect>
                    </FormGroup>
                    <FormGroup class="col-md-12">
                        <FormLabel class="form-label">Description</FormLabel>
                        <FormTextarea rows="2" v-model="device.description" placeholder="Enter device description"></FormTextarea>
                    </FormGroup>
                </div>

                <div v-if="isNewDevice" class="d-flex justify-content-end mt-4">
                    <FormSubmitBtn class="btn btn-primary text-right" type="submit" :disabled="isSubmitDisabled">
                        Create Device
                    </FormSubmitBtn>
                </div>

            </div>

            <div v-if="!isNewDevice" class="box-container d-flex flex-column justify-content-center mt-4">

                <h4 class="text-white mb-4">Connection Details</h4>

                <div class="row mb-4">
                    <FormGroup class="col-md-6">
                        <FormLabel>Connection ID</FormLabel>
                        <FormInput v-model="device.id" disabled />
                    </FormGroup>
                    <FormGroup class="col-md-6">
                        <FormLabel>Connection Secret</FormLabel>
                        <FormPWInput v-model="device.secret" autocomplete="" required />
                    </FormGroup>
                </div>

                <div class="d-flex justify-content-end">
                    <FormSubmitBtn class="btn btn-primary text-right" type="submit" :disabled="isSubmitDisabled">
                        Update Device
                    </FormSubmitBtn>
                </div>

            </div>

        </form>

    </DashboardPage>

    <div></div>

</template>

<style scoped>

</style>
