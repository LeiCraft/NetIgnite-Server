<template>
    <div class="device-management-page">
        <!-- Header Section -->
        <section class="dashboard-header py-4">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-6">
                        <h1 class="display-5 fw-bold text-white mb-2">
                            <i class="bi bi-hdd-network text-primary me-3"></i>
                            Device Management
                        </h1>
                        <p class="text-light opacity-75 mb-0">
                            View and manage your network devices
                        </p>
                    </div>
                    <div class="col-lg-6 text-lg-end">
                        <button class="btn btn-primary btn-lg text-dark fw-bold px-4 py-3"
                            @click="showAddDeviceModal = true">
                            <i class="bi bi-plus-circle me-2"></i>
                            Add New Device
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Devices Section -->
        <section class="devices-section py-5">
            <div class="container">
                <div class="row mb-4">
                    <div class="col-md-6">
                        <div class="input-group">
                            <span class="input-group-text bg-dark border-secondary">
                                <i class="bi bi-search text-light"></i>
                            </span>
                            <input type="text" class="form-control bg-dark border-secondary text-light"
                                placeholder="Search devices..." v-model="searchQuery">
                        </div>
                    </div>
                    <div class="col-md-3">
                        <select class="form-select bg-dark border-secondary text-light" v-model="statusFilter">
                            <option value="">All Status</option>
                            <option value="online">Online</option>
                            <option value="standby">Standby</option>
                            <option value="offline">Offline</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <select class="form-select bg-dark border-secondary text-light" v-model="typeFilter">
                            <option value="">All Types</option>
                            <option value="router">Routers</option>
                            <option value="server">Servers</option>
                            <option value="desktop">Desktop PCs</option>
                            <option value="laptop">Laptops</option>
                            <option value="printer">Printers</option>
                            <option value="nas">NAS Storage</option>
                            <option value="switch">Network Switches</option>
                        </select>
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
                                            <i :class="getDeviceIcon(device.type)"></i>
                                        </div>
                                        <div>
                                            <div class="fw-bold text-white">{{ device.name }}</div>
                                            <div class="small text-light opacity-75">{{ device.description }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="d-none d-md-table-cell">{{ device.ipAddress }}</td>
                                <td class="d-none d-lg-table-cell font-monospace small">{{ device.macAddress }}</td>
                                <td class="text-center">
                                    <span :class="getStatusBadgeClass(device.status)" class="badge px-3 py-2">
                                        <i :class="getStatusIcon(device.status)" class="me-1"></i>
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
                                    <i :class="getDeviceIcon(device.type)" class="fs-1 mb-2"></i>
                                </div>
                                <span :class="getStatusBadgeClass(device.status)" class="badge px-3 py-2">
                                    <i :class="getStatusIcon(device.status)" class="me-1"></i>
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
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="text-light opacity-75">Last Seen:</span>
                                    <span class="text-light small">{{ formatLastSeen(device.lastSeen) }}</span>
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
                <div class="modal-content bg-dark border-secondary">
                    <div class="modal-header border-secondary">
                        <h5 class="modal-title text-white">
                            <i class="bi bi-plus-circle text-primary me-2"></i>
                            {{ editingDevice ? 'Edit Device' : 'Add New Device' }}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveDevice">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label text-light">Device Name</label>
                                    <input type="text" class="form-control bg-dark border-secondary text-light"
                                        v-model="deviceForm.name" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label text-light">Device Type</label>
                                    <select class="form-select bg-dark border-secondary text-light"
                                        v-model="deviceForm.type" required>
                                        <option value="">Select Type</option>
                                        <option value="router">Router</option>
                                        <option value="server">Server</option>
                                        <option value="desktop">Desktop PC</option>
                                        <option value="laptop">Laptop</option>
                                        <option value="printer">Printer</option>
                                        <option value="nas">NAS Storage</option>
                                        <option value="switch">Network Switch</option>
                                    </select>
                                </div>
                                <div class="col-12">
                                    <label class="form-label text-light">Description</label>
                                    <textarea class="form-control bg-dark border-secondary text-light" rows="2"
                                        v-model="deviceForm.description"></textarea>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label text-light">IP Address</label>
                                    <input type="text" class="form-control bg-dark border-secondary text-light"
                                        v-model="deviceForm.ipAddress" pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$"
                                        required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label text-light">MAC Address</label>
                                    <input type="text"
                                        class="form-control bg-dark border-secondary text-light font-monospace"
                                        v-model="deviceForm.macAddress"
                                        pattern="^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$"
                                        placeholder="AA:BB:CC:DD:EE:FF" required>
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
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

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
const devices = ref([
    {
        id: 1,
        name: 'Main Router',
        type: 'router',
        description: 'Primary network router',
        ipAddress: '192.168.1.1',
        macAddress: 'AA:BB:CC:DD:EE:01',
        status: 'online',
        lastSeen: new Date(),
        powering: false
    },
    {
        id: 2,
        name: 'File Server',
        type: 'server',
        description: 'Main file storage server',
        ipAddress: '192.168.1.100',
        macAddress: 'AA:BB:CC:DD:EE:02',
        status: 'offline',
        lastSeen: new Date(Date.now() - 3600000),
        powering: false
    },
    {
        id: 3,
        name: 'Office Printer',
        type: 'printer',
        description: 'HP LaserJet Pro',
        ipAddress: '192.168.1.150',
        macAddress: 'AA:BB:CC:DD:EE:03',
        status: 'online',
        lastSeen: new Date(),
        powering: false
    },
    {
        id: 4,
        name: 'Gaming PC',
        type: 'desktop',
        description: 'High-performance gaming computer',
        ipAddress: '192.168.1.200',
        macAddress: 'AA:BB:CC:DD:EE:04',
        status: 'standby',
        lastSeen: new Date(Date.now() - 1800000),
        powering: false
    },
    {
        id: 5,
        name: 'Development Laptop',
        type: 'laptop',
        description: 'MacBook Pro M1',
        ipAddress: '192.168.1.201',
        macAddress: 'AA:BB:CC:DD:EE:05',
        status: 'online',
        lastSeen: new Date(),
        powering: false
    },
    {
        id: 6,
        name: 'Network Switch',
        type: 'switch',
        description: 'Managed 24-port switch',
        ipAddress: '192.168.1.2',
        macAddress: 'AA:BB:CC:DD:EE:06',
        status: 'online',
        lastSeen: new Date(),
        powering: false
    }
])

const showAddDeviceModal = ref(false)
const editingDevice = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const viewMode = ref('table')

const deviceForm = ref({
    name: '',
    type: '',
    description: '',
    ipAddress: '',
    macAddress: ''
})

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

    return filtered
})

// Methods
const getDeviceIcon = (type: string) => {
    const icons = {
        router: 'bi bi-router text-primary',
        server: 'bi bi-hdd-network text-info',
        desktop: 'bi bi-pc-display text-warning',
        laptop: 'bi bi-laptop text-warning',
        printer: 'bi bi-printer text-success',
        nas: 'bi bi-hdd-stack text-info',
        switch: 'bi bi-diagram-3 text-primary'
    }
    return icons[type] || 'bi bi-device-hdd text-secondary'
}

const getStatusBadgeClass = (status: string) => {
    const classes = {
        online: 'bg-success',
        standby: 'bg-warning',
        offline: 'bg-danger'
    }
    return classes[status] || 'bg-secondary'
}

const getStatusIcon = (status: string) => {
    const icons = {
        online: 'bi bi-check-circle-fill',
        standby: 'bi bi-pause-circle-fill',
        offline: 'bi bi-x-circle-fill'
    }
    return icons[status] || 'bi bi-question-circle-fill'
}

const formatLastSeen = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`

    const days = Math.floor(hours / 24)
    return `${days}d ago`
}

const powerOnDevice = async (deviceId: number) => {
    const device = devices.value.find(d => d.id === deviceId)
    if (device) {
        device.powering = true
        // Simulate API call
        setTimeout(() => {
            device.status = 'online'
            device.lastSeen = new Date()
            device.powering = false
        }, 2000)
    }
}

const shutdownDevice = async (deviceId: number) => {
    const device = devices.value.find(d => d.id === deviceId)
    if (device) {
        device.status = 'offline'
        device.lastSeen = new Date()
    }
}

const pingDevice = async (deviceId: number) => {
    const device = devices.value.find(d => d.id === deviceId)
    if (device) {
        device.lastSeen = new Date()
    }
}

const editDevice = (device: any) => {
    editingDevice.value = device
    deviceForm.value = { ...device }
    showAddDeviceModal.value = true
}

const deleteDevice = (deviceId: number) => {
    if (confirm('Are you sure you want to delete this device?')) {
        const index = devices.value.findIndex(d => d.id === deviceId)
        if (index > -1) {
            devices.value.splice(index, 1)
        }
    }
}

const saveDevice = () => {
    if (editingDevice.value) {
        // Update existing device
        const index = devices.value.findIndex(d => d.id === editingDevice.value.id)
        if (index > -1) {
            devices.value[index] = { ...devices.value[index], ...deviceForm.value }
        }
    } else {
        // Add new device
        const newDevice = {
            id: Date.now(),
            ...deviceForm.value,
            status: 'offline',
            lastSeen: new Date(),
            powering: false
        }
        devices.value.push(newDevice)
    }
    closeModal()
}

const closeModal = () => {
    showAddDeviceModal.value = false
    editingDevice.value = null
    deviceForm.value = {
        name: '',
        type: '',
        description: '',
        ipAddress: '',
        macAddress: ''
    }
}

// Lifecycle
onMounted(() => {
    // Initialize any required data or services
})
</script>

<style scoped>
.device-management-page {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    min-height: 100vh;
}

.dashboard-header {
    background-color: rgba(0, 0, 0, 0.2);
}

.devices-section {
    background-color: #1a1b2e;
}

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

.form-control:focus,
.form-select:focus {
    background-color: #0b0c1b !important;
    border-color: var(--bs-primary) !important;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
    color: white !important;
}

.modal-backdrop {
    background-color: rgba(0, 0, 0, 0.8);
}

.btn-primary {
    background-color: #0dcaf0;
    border-color: #0dcaf0;
    color: #000 !important;
}

.btn-primary:hover {
    background-color: #31d2f2;
    border-color: #25cff2;
    color: #000 !important;
}

.btn-outline-primary {
    border-color: #0dcaf0;
    color: #0dcaf0;
}

.btn-outline-primary:hover {
    background-color: #0dcaf0;
    color: #000 !important;
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