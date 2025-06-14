<template>
    <DashboardPage title="Manage Devices" subtitle="View and manage your network devices" image="bi bi-hdd-network"
        class="device-management-page">

        <div class="row mb-4">
            <div class="col-md-4">
                <div class="input-group">
                    <span class="input-group-text form-input-small">
                        <i class="bi bi-search text-light"></i>
                    </span>
                    <input type="text" class="form-control form-input-small" placeholder="Search devices..."
                        v-model="searchQuery">
                </div>
            </div>
            <div class="col-md-3">
                <select class="form-select form-input" v-model="statusFilter">
                    <option value="">All Status</option>
                    <option v-for="type in ModelUtils.OnlineStatus.getAllTypes()" :value="type.name">
                        {{ type.label }}
                    </option>
                </select>
            </div>
            <div class="col-md-3">
                <select class="form-select form-input" v-model="typeFilter">
                    <option value="">All Types</option>
                    <option v-for="type in Device.Utils.getAllDeviceTypes()" :value="type.name">
                        {{ type.label }}
                    </option>
                </select>
            </div>
            <div class="col-md-2">
                <NuxtLink role="button" to="/devices/new" class="btn btn-primary fw-bold w-100">
                    <i class="bi bi-plus-circle me-2"></i>
                    Add New Device
                </NuxtLink>
            </div>
        </div>

        <!-- Device Table -->
        <SimpleTable>
            <thead>
                <tr>
                    <th scope="col">Device</th>
                    <th scope="col" class="text-center">Status</th>
                    <th scope="col" class="text-end">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(device, index) in filteredDevices" :key="device.id">
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="device-icon me-3">
                                <i :class="device.getDeviceIcon()"></i>
                            </div>
                            <div>
                                <div class="fw-bold text-white text-break">{{ device.name }}</div>
                                <div class="small text-light opacity-75 text-break">{{ device.description }}</div>
                            </div>
                        </div>
                    </td>
                    <td class="text-center">
                        <span :class="device.getStatusBadgeClass()" class="badge px-3 py-2">
                            <i :class="device.getStatusIcon()" class="me-1"></i>
                            {{ device.status.charAt(0).toUpperCase() + device.status.slice(1) }}
                        </span>
                    </td>
                    <td>
                        <div class="d-flex justify-content-end gap-2">

                            <button v-if="device.status !== 'online'" class="btn btn-success btn-sm"
                                @click="device.wakeUP()" :disabled="device.powering" title="Power On">
                                <i class="bi"
                                    :class="device.powering ? 'spinner-border spinner-border-sm' : 'bi-power'"></i>
                            </button>
                            <button v-else-if="device.status === 'online'" class="btn btn-warning btn-sm"
                                @click="device.shutdown()" title="Shutdown">
                                <i class="bi bi-stop-circle"></i>
                            </button>
                            <button v-else class="btn btn-secondary btn-sm" disabled @click="device.shutdown()"
                                title="Shutdown">
                                <i class="bi bi-question-circle-fill"></i>
                            </button>

                            <button class="btn btn-info btn-sm" @click="device.refreshStatus()" title="Ping">
                                <i class="bi bi-arrow-repeat"></i>
                            </button>
                            <NuxtLink role="button" :to="`/devices/${device.id}`" class="btn btn-primary btn-sm"
                                title="Edit">
                                <i class="bi bi-pencil"></i>
                            </NuxtLink>
                            <button class="btn btn-light btn-sm" @click="device.toggleFavorite()" title="Favorite">
                                <i :class="device.getFavoriteIcon()"></i>
                            </button>
                            <button class="btn btn-danger btn-sm" @click="deleteDevice(device.id)" title="Delete">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </SimpleTable>

        <div v-if="filteredDevices.length === 0" class="text-center py-5 rounded-4 bg-dark bg-opacity-50">
            <i class="bi bi-inbox text-light opacity-50" style="font-size: 4rem;"></i>
            <h4 class="text-light opacity-75 mt-3">No devices found</h4>
            <p class="text-light opacity-50">
                {{ devices.length === 0 ? 'Add your first device to get started' : 'No devices match your search criteria' }}
            </p>
        </div>

    </DashboardPage>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import { Device } from '@/utils/models/device';

import DashboardPage from '@/components/DashboardPage.vue';
import SimpleTable from '~/components/SimpleTable.vue';
import { ModelUtils } from '~/utils/models/utils';
import { useDataFilter } from '~/composables/useDataFilter';
import { useAPI } from '~/composables/useAPI';

definePageMeta({
    layout: 'dashboard',
    middleware: 'auth',
});


// Reactive data
const devices = reactive<Device[]>(await getDevices());

async function getDevices() {

    const response = await useAPI("/api/devices", {
        method: 'GET'
    });

    if (response.status !== "OK" || !response.data) {
        useNotificationToast({
            message: `Error fetching device: ${response?.message || 'unknown error'}`,
            type: 'error'
        });
        return [];
    }

    return response.data.map((deviceData) => new Device({
        ...deviceData,
        status: 'unknown'
    }));

}

async function deleteDevice(deviceID: number) {
    if (confirm('Are you sure you want to delete this device?')) {
        const index = devices.findIndex(d => d.id === deviceID)
        if (index > -1) {
            const response = await useAPI(`/api/devices/${deviceID}`, {
                method: 'DELETE',
                body: JSON.stringify(devices[index]),
            });

            if (response.status !== "OK") {
                useNotificationToast({
                    message: `Error deleting device: ${response?.message || 'unknown error'}`,
                    type: 'error'
                });
                return;
            }
                
            devices.splice(index, 1);
            useNotificationToast({
                message: response.message,
                type: 'success'
            });
        }
    }
}


const searchQuery = ref('');
const statusFilter = ref('');
const typeFilter = ref('');

const filteredDevices = useDataFilter(devices, {
    search: {
        query: searchQuery,
        props: ['name', 'description'],
    },
    match: [
        { query: statusFilter, prop: 'status' },
        { query: typeFilter, prop: 'type' }
    ]
});


function refreshAllDevicesStatuses() {
    return Device.Utils.updateStatuses(devices);
}

let statusRefreshInterval: number | null = null;

onMounted(() => {
    refreshAllDevicesStatuses();
    statusRefreshInterval = window.setInterval(refreshAllDevicesStatuses, 20000);
});

onUnmounted(() => {
    if (statusRefreshInterval !== null) {
        clearInterval(statusRefreshInterval);
        statusRefreshInterval = null;
    }
});

</script>

<style scoped>
@import url('/assets/css/forms.css');

.device-icon {
    min-width: 40px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    font-size: 1.25rem;
}
</style>

<!-- // Card View

// <!-- 
//                 .device-card {
//     background-color: #0b0c1b;
//     border: 1px solid rgba(255, 255, 255, 0.1);
//     transition: transform 0.3s ease, box-shadow 0.3s ease;
// }

// .device-card:hover {
//     transform: translateY(-5px);
//     box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
// }

// .device-icon-container {
//     width: 60px;
//     height: 60px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     background-color: rgba(255, 255, 255, 0.05);
//     border-radius: 12px;
// } -->