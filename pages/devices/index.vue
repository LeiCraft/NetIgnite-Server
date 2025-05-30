<template>
    <DashboardPage title="Device Management" subtitle="View and manage your network devices" image="bi bi-hdd-network" class="device-management-page">

        <!-- Devices Section -->
        <section class="devices-section py-5">
            <div class="container">
                <div class="row mb-4">
                    <div class="col-md-4">
                        <div class="input-group">
                            <span class="input-group-text form-input-small">
                                <i class="bi bi-search text-light"></i>
                            </span>
                            <input type="text" class="form-control form-input-small"
                                placeholder="Search devices..." v-model="searchQuery">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <select class="form-select form-input" v-model="statusFilter">
                            <option value="">All Status</option>
                            <option value="online">Online</option>
                            <option value="standby">Standby</option>
                            <option value="offline">Offline</option>
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
                        <button class="btn btn-primary fw-bold w-100"
                            @click="showAddDeviceModal = true">
                            <i class="bi bi-plus-circle me-2"></i>
                            Add New Device
                        </button>
                    </div>
                </div>

                <!-- Device Table -->
                <div class="device-table-container rounded-4 overflow-hidden mb-4">
                    <table class="table table-dark table-hover mb-0">
                        <thead>
                            <tr>
                                <th scope="col" style="width: 50px">#</th>
                                <th scope="col">Device</th>
                                <th scope="col" class="d-none d-md-table-cell">IP Address</th>
                                <th scope="col" class="d-none d-lg-table-cell">MAC Address</th>
                                <th scope="col" class="text-center">Status</th>
                                <th scope="col" class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(device, index) in filteredDevices" :key="device.id">
                                <td>{{ index + 1 }}</td>
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
                                <td class="d-none d-md-table-cell">{{ device.ipAddress }}</td>
                                <td class="d-none d-lg-table-cell font-monospace small">{{ device.macAddress }}</td>
                                <td class="text-center">
                                    <span :class="device.getStatusBadgeClass()" class="badge px-3 py-2">
                                        <i :class="device.getStatusIcon()" class="me-1"></i>
                                        {{ device.status.charAt(0).toUpperCase() + device.status.slice(1) }}
                                    </span>
                                </td>
                                <td>
                                    <div class="d-flex justify-content-end gap-2">
                                        <button v-if="device.status === 'offline' || device.status === 'standby'"
                                            class="btn btn-success btn-sm" @click="powerOnDevice(device.id)"
                                            :disabled="device.powering" title="Power On">
                                            <i class="bi"
                                                :class="device.powering ? 'spinner-border spinner-border-sm' : 'bi-power'"></i>
                                        </button>
                                        <button v-if="device.status === 'online'" class="btn btn-warning btn-sm"
                                            @click="shutdownDevice(device.id)" title="Shutdown">
                                            <i class="bi bi-stop-circle"></i>
                                        </button>
                                        <button class="btn btn-info btn-sm" @click="pingDevice(device.id)" title="Ping">
                                            <i class="bi bi-arrow-repeat"></i>
                                        </button>
                                        <button class="btn btn-primary btn-sm" @click="editDevice(device)" title="Edit">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                        <button class="btn btn-light btn-sm" @click="toggleFavioriteDevice(device)" title="Favorite">
                                            <i :class="device.getFavoriteIcon()"></i>
                                        </button>
                                        <button class="btn btn-danger btn-sm" @click="deleteDevice(device.id)"
                                            title="Delete">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div v-if="filteredDevices.length === 0" class="text-center py-5 rounded-4 bg-dark bg-opacity-50">
                    <i class="bi bi-inbox text-light opacity-50" style="font-size: 4rem;"></i>
                    <h4 class="text-light opacity-75 mt-3">No devices found</h4>
                    <p class="text-light opacity-50">
                        {{ devices.length === 0 ? 'Add your first device to get started' : 'No devices match your search criteria' }}
                    </p>
                </div>

                <!-- Card View Toggle -->
                <div class="d-flex justify-content-center mt-4">
                    <div class="btn-group" role="group">
                        <button type="button" class="btn"
                            :class="viewMode === 'table' ? 'btn-primary text-dark' : 'btn-outline-primary'"
                            @click="viewMode = 'table'">
                            <i class="bi bi-table me-2"></i>Table View
                        </button>
                        <button type="button" class="btn"
                            :class="viewMode === 'card' ? 'btn-primary text-dark' : 'btn-outline-primary'"
                            @click="viewMode = 'card'">
                            <i class="bi bi-grid-3x3-gap me-2"></i>Card View
                        </button>
                    </div>
                </div>

                <!-- Card View -->
                <div v-if="viewMode === 'card'" class="row g-4 mt-3">
                    <div class="col-lg-4 col-md-6" v-for="device in filteredDevices" :key="device.id">
                        <div class="device-card rounded-4 p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <div class="device-icon-container">
                                    <i :class="device.getDeviceIcon()" class="fs-1 mb-2"></i>
                                </div>
                                <span :class="device.getStatusBadgeClass()" class="badge px-3 py-2">
                                    <i :class="device.getStatusIcon()" class="me-1"></i>
                                    {{ device.status.charAt(0).toUpperCase() + device.status.slice(1) }}
                                </span>
                            </div>

                            <h5 class="fw-bold text-white mb-2">{{ device.name }}</h5>
                            <p class="text-light opacity-75 mb-3">{{ device.description }}</p>

                            <div class="device-details mb-3">
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="text-light opacity-75">IP Address:</span>
                                    <span class="text-light">{{ device.ipAddress }}</span>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="text-light opacity-75">MAC Address:</span>
                                    <span class="text-light font-monospace small">{{ device.macAddress }}</span>
                                </div>
                            </div>

                            <div class="d-flex justify-content-between">
                                <button class="btn btn-primary w-100" @click="editDevice(device)">
                                    <i class="bi bi-gear me-2"></i>Manage
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Add/Edit Device Modal -->
        <div class="modal fade" :class="{ show: showAddDeviceModal }"
            :style="{ display: showAddDeviceModal ? 'block' : 'none' }" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content border-secondary device-modal">
                    <div class="modal-header border-secondary">
                        <h5 class="modal-title text-white">
                            <i class="bi bi-plus-circle text-primary me-2"></i>
                            {{ editingDevice ? 'Edit Device' : 'Add New Device' }}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
                    </div>
                    <div class="modal-body text-light">
                        <form @submit.prevent="saveDevice">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">Device Name</label>
                                    <input type="text" class="form-control form-input" v-model="deviceForm.values.name" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Device Type</label>
                                    <select class="form-select form-input" v-model="deviceForm.values.type" required>
                                        <option value="" disabled>Select Device Type</option>
                                        <option v-for="type in Device.Utils.getAllDeviceTypes()" :value="type.name">
                                            {{ type.label }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-12">
                                    <label class="form-label">Description</label>
                                    <textarea class="form-control form-input" rows="2" v-model="deviceForm.values.description"></textarea>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">IP Address</label>
                                    <input type="text" class="form-control form-input" v-model="deviceForm.values.ipAddress" pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">MAC Address</label>
                                    <input type="text" class="form-control form-input font-monospace" v-model="deviceForm.values.macAddress" pattern="^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$" placeholder="AA:BB:CC:DD:EE:FF" required>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer border-secondary">
                        <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
                        <button type="button" class="btn btn-primary text-dark fw-bold" @click="saveDevice">
                            <i class="bi bi-check-circle me-2"></i>
                            {{ editingDevice ? 'Update Device' : 'Add Device' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showAddDeviceModal" class="modal-backdrop fade show"></div>
    </DashboardPage>
</template>

<script setup lang="ts">

import { ref, computed, onMounted } from 'vue'
import { Device } from '@/utils/models/device';

import DashboardPage from '@/components/DashboardPage.vue';

// SEO Meta
useSeoMeta({
    title: 'NetIgnite - Device Management',
    description: 'Manage your network devices with NetIgnite',
});

definePageMeta({
	layout: 'dashboard',
	middleware: 'auth',
});


// Reactive data
const devices = ref<Device[]>([
    Device.fromData({
        id: 1,
        name: 'Proxmox Server',
        type: 'server',
        description: 'Primary Proxmox virtualization server',
        ipAddress: '192.168.1.1',
        macAddress: 'AA:BB:CC:DD:EE:01',
        status: 'online',
        powering: false
    }),
    Device.fromData({
        id: 2,
        name: 'File Server',
        type: 'server',
        description: 'Main file storage server',
        ipAddress: '192.168.1.100',
        macAddress: 'AA:BB:CC:DD:EE:02',
        status: 'offline',
        powering: false
    }),
    Device.fromData({
        id: 3,
        name: 'Office Printer',
        type: 'printer',
        description: 'HP LaserJet Pro',
        ipAddress: '192.168.1.150',
        macAddress: 'AA:BB:CC:DD:EE:03',
        status: 'online',
        powering: false
    }),
    Device.fromData({
        id: 4,
        name: 'Gaming PC',
        type: 'desktop',
        description: 'High-performance gaming computer',
        ipAddress: '192.168.1.200',
        macAddress: 'AA:BB:CC:DD:EE:04',
        status: 'standby',
        powering: false
    }),
    Device.fromData({
        id: 5,
        name: 'Development Laptop',
        type: 'laptop',
        description: 'MacBook Pro M1',
        ipAddress: '192.168.1.201',
        macAddress: 'AA:BB:CC:DD:EE:05',
        status: 'online',
        powering: false
    }),
    Device.fromData({
        id: 6,
        name: 'Home NAS',
        type: 'nas',
        description: '24TB NAS Storage',
        ipAddress: '192.168.1.2',
        macAddress: 'AA:BB:CC:DD:EE:06',
        status: 'online',
        powering: false
    })
]);


const showAddDeviceModal = ref(false);
const editingDevice = ref(null);
const searchQuery = ref('');
const statusFilter = ref('');
const typeFilter = ref('');
const viewMode = ref('table');



// Computed properties
const filteredDevices = computed(() => {
    let filtered = devices.value

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(device =>
            device.name.toLowerCase().includes(query) ||
            device.description.toLowerCase().includes(query) ||
            device.ipAddress.includes(query)
        )
    }

    if (statusFilter.value) {
        filtered = filtered.filter(device => device.status === statusFilter.value)
    }

    if (typeFilter.value) {
        filtered = filtered.filter(device => device.type === typeFilter.value)
    }

    return filtered;
});



async function powerOnDevice(deviceId: number) {
    const device = devices.value.find(d => d.id === deviceId);
    if (device) {
        device.powering = true;
        // Simulate API call
        setTimeout(() => {
            device.status = 'online'
            device.powering = false
        }, 2000);
    }
}

async function shutdownDevice(deviceId: number) {
    const device = devices.value.find(d => d.id === deviceId);
    if (device) {
        device.status = 'offline';
    }
}

async function pingDevice(deviceId: number) {
    const device = devices.value.find(d => d.id === deviceId);
    if (device) {
    }
}

function editDevice(device: Device) {
    editingDevice.value = device as any;
    deviceForm.set({ ...device });
    showAddDeviceModal.value = true;
}

function toggleFavioriteDevice(device: Device) {
    // Placeholder for favorite functionality
    device.isFavorite = !device.isFavorite;
}


function deleteDevice(deviceId: number) {
    if (confirm('Are you sure you want to delete this device?')) {
        const index = devices.value.findIndex(d => d.id === deviceId)
        if (index > -1) {
            devices.value.splice(index, 1)
        }
    }
}
const deviceForm = new FormModel(
    {
        name: '',
        type: '' as Device.Type,
        description: '',
        ipAddress: '',
        macAddress: ''
    },
    saveDevice
);

function saveDevice() {
    if (editingDevice.value) {
        // Update existing device
        const index = devices.value.findIndex(d => d.id === (editingDevice as any).value.id);
        if (index > -1) {
            (devices as any).value[index] = Device.fromData({ ...devices.value[index] as Device, ...deviceForm.values });
        }
    } else {
        // Add new device
        const newDevice = Device.fromData({
            id: Date.now(),
            ...deviceForm.values,
            status: 'offline',
            powering: false
        });
        devices.value.push(newDevice);
    }
    closeModal();
}

function closeModal() {
    showAddDeviceModal.value = false;
    editingDevice.value = null;
    deviceForm.reset();
}

// Lifecycle
onMounted(() => {
    // Initialize any required data or services
});


</script>

<style scoped>

@import url('/assets/forms.css');

.device-table-container {
    background-color: #0b0c1b;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.table {
    margin-bottom: 0;
}

.table-dark {
    --bs-table-bg: transparent;
    --bs-table-striped-bg: rgba(255, 255, 255, 0.05);
    --bs-table-hover-bg: rgba(255, 255, 255, 0.1);
}

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

.device-modal {
    background-color: #1a1b2e;
    /* border: 1px solid rgba(255, 255, 255, 0.1); */
}

.modal-backdrop {
    background-color: rgba(0, 0, 0, 0.8);
}

@media (max-width: 768px) {
    .device-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
    }

    .device-actions .btn {
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
    }
}
</style>