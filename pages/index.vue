<template>

	<DashboardPage title="Manage Devices" subtitle="View and manage your network devices" image="bi bi-hdd-network"
		class="device-management-page">

		<div class="row g-4 mb-5">
			<div class="col-md-3">
				<div class="stat-card bg-success bg-opacity-10 rounded-4 p-4 text-center">
					<i class="bi bi-check-circle-fill text-success fs-1 mb-2"></i>
					<h3 class="fw-bold text-white">{{ onlineDevices }}</h3>
					<p class="text-success mb-0">Online</p>
				</div>
			</div>
			<div class="col-md-3">
				<div class="stat-card bg-warning bg-opacity-10 rounded-4 p-4 text-center">
					<i class="bi bi-pause-circle-fill text-warning fs-1 mb-2"></i>
					<h3 class="fw-bold text-white">{{ unknownDevices }}</h3>
					<p class="text-warning mb-0">Unknown</p>
				</div>
			</div>
			<div class="col-md-3">
				<div class="stat-card bg-danger bg-opacity-10 rounded-4 p-4 text-center">
					<i class="bi bi-x-circle-fill text-danger fs-1 mb-2"></i>
					<h3 class="fw-bold text-white">{{ offlineDevices }}</h3>
					<p class="text-danger mb-0">Offline</p>
				</div>
			</div>
			<div class="col-md-3">
				<div class="stat-card bg-info bg-opacity-10 rounded-4 p-4 text-center">
					<i class="bi bi-hdd-network-fill text-info fs-1 mb-2"></i>
					<h3 class="fw-bold text-white">{{ totalDevices }}</h3>
					<p class="text-info mb-0">Total Devices</p>
				</div>
			</div>
		</div>

		<h3 class="fw-bold text-white mb-0">Your Devices</h3>

		<div class="row g-4 mt-3">
			<div class="col-lg-4 col-md-6" v-for="device in devices" :key="device.id">
				<div class="device-card rounded-4 p-4 h-100">
					<div class="device-icon-container mb-3">
						<i :class="device.getDeviceIcon()" class="fs-1"></i>
					</div>

					<h5 class="fw-bold text-white mb-2">{{ device.name }}</h5>
					<p class="text-light opacity-75 mb-3">{{ device.description }}</p>

					<div class="d-flex justify-content-between align-items-center">
						<span :class="device.getStatusBadgeClass()" class="badge px-3 py-2">
							<i :class="device.getStatusIcon()" class="me-1"></i>
							{{ device.status.charAt(0).toUpperCase() + device.status.slice(1) }}
						</span>

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
						</div>
					</div>
				</div>
			</div>
		</div>

		<div v-if="devices.length === 0" class="text-center py-5 rounded-4 bg-dark bg-opacity-50">
            <i class="bi bi-inbox text-light opacity-50" style="font-size: 4rem;"></i>
            <h4 class="text-light opacity-75 mt-3">No devices found</h4>
            <p class="text-light opacity-50">
				Add your first device to get started
            </p>
        </div>

	</DashboardPage>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Device } from '~/utils/models/device';

definePageMeta({
    layout: 'dashboard',
    middleware: 'auth',
});


// Reactive data
const devices = reactive<Device[]>(await getDevices());

async function getDevices() {

    const { data } = await useFetch("/api/devices", {
        method: 'GET',
		query: {
			// onlyFavorites: true
		}
    });
    const response = data.value;

    if (!response || response.status !== "OK" || !response.data) {
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


function refreshAllDevicesStatuses() {
    // return Device.Utils.updateStatuses(devices);
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


const totalDevices = computed(() => devices.length)
const onlineDevices = computed(() => devices.filter(d => d.status === 'online').length)
const offlineDevices = computed(() => devices.filter(d => d.status === 'offline').length)
const unknownDevices = computed(() => devices.filter(d => d.status === 'unknown').length)

</script>

<style scoped>
.stat-card {
	background-color: #0b0c1b !important;
	border: 1px solid rgba(255, 255, 255, 0.1);
	transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.device-card {
	background-color: #0b0c1b;
	border: 1px solid rgba(255, 255, 255, 0.1);
	transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.device-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.device-icon-container {
	width: 60px;
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: rgba(255, 255, 255, 0.05);
	border-radius: 12px;
}

.device-details {
	font-size: 0.9rem;
}

@media (max-width: 768px) {
	.device-actions {
		display: flex;
		gap: 0.5rem;
	}

	.device-actions .btn {
		padding: 0.25rem 0.5rem;
		font-size: 0.875rem;
	}
}
</style>