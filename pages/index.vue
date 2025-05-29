<template>
	<div class="dashboard-page">
		<!-- Header Section -->
		<section class="dashboard-header py-4">
			<div class="container">
				<div class="row align-items-center">
					<div class="col-lg-6">
						<h1 class="display-5 fw-bold text-white mb-2">
							<i class="bi bi-speedometer2 text-primary me-3"></i>
							Device Dashboard
						</h1>
						<p class="text-light opacity-75 mb-0">
							Manage and monitor your network devices
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

		<!-- Stats Section -->
		<section class="stats-section py-4">
			<div class="container">
				<div class="row g-4">
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
							<h3 class="fw-bold text-white">{{ standbyDevices }}</h3>
							<p class="text-warning mb-0">Standby</p>
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
			</div>
		</section>

		<!-- Devices Section -->
		<section class="devices-section py-5">
			<div class="container">
				<div class="row mb-4">
					<div class="col-lg-6">
						<h3 class="fw-bold text-white mb-0">Your Devices</h3>
					</div>
					<div class="col-lg-6">
						<div class="d-flex gap-3 justify-content-lg-end">
							<div class="input-group" style="max-width: 300px;">
								<span class="input-group-text bg-dark border-secondary">
									<i class="bi bi-search text-light"></i>
								</span>
								<input type="text" class="form-control bg-dark border-secondary text-light"
									placeholder="Search devices..." v-model="searchQuery">
							</div>
							<select class="form-select bg-dark border-secondary text-light" style="max-width: 150px;"
								v-model="statusFilter">
								<option value="">All Status</option>
								<option value="online">Online</option>
								<option value="standby">Standby</option>
								<option value="offline">Offline</option>
							</select>
						</div>
					</div>
				</div>

				<div class="row g-4">
					<div class="col-lg-4 col-md-6" v-for="device in filteredDevices" :key="device.id">
						<div class="device-card rounded-4 p-4 h-100">
							<div class="d-flex justify-content-between align-items-start mb-3">
								<div class="device-icon-container">
									<i :class="getDeviceIcon(device.type)" class="fs-1 mb-2"></i>
								</div>
								<div class="dropdown">
									<button class="btn btn-link text-light p-0" data-bs-toggle="dropdown">
										<i class="bi bi-three-dots-vertical"></i>
									</button>
									<ul class="dropdown-menu dropdown-menu-dark">
										<li><a class="dropdown-item" href="#" @click="editDevice(device)">
												<i class="bi bi-pencil me-2"></i>Edit
											</a></li>
										<li><a class="dropdown-item" href="#" @click="deleteDevice(device.id)">
												<i class="bi bi-trash me-2"></i>Delete
											</a></li>
									</ul>
								</div>
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

							<div class="d-flex justify-content-between align-items-center">
								<span :class="getStatusBadgeClass(device.status)" class="badge px-3 py-2">
									<i :class="getStatusIcon(device.status)" class="me-1"></i>
									{{ device.status.charAt(0).toUpperCase() + device.status.slice(1) }}
								</span>

								<div class="device-actions">
									<button v-if="device.status === 'offline' || device.status === 'standby'"
										class="btn btn-success btn-sm me-2" @click="powerOnDevice(device.id)"
										:disabled="device.powering">
										<i class="bi bi-power"
											:class="{ 'spinner-border spinner-border-sm': device.powering }"></i>
									</button>
									<button v-if="device.status === 'online'" class="btn btn-warning btn-sm me-2"
										@click="shutdownDevice(device.id)">
										<i class="bi bi-stop-circle"></i>
									</button>
									<button class="btn btn-info btn-sm" @click="pingDevice(device.id)">
										<i class="bi bi-arrow-repeat"></i>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div v-if="filteredDevices.length === 0" class="text-center py-5">
					<i class="bi bi-inbox text-light opacity-50" style="font-size: 4rem;"></i>
					<h4 class="text-light opacity-75 mt-3">No devices found</h4>
					<p class="text-light opacity-50">Add your first device to get started</p>
				</div>
			</div>
		</section>

		<!-- Add Device Modal -->
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
	title: 'NetIgnite Dashboard - Manage Your Devices',
	description: 'Manage and monitor your network devices with NetIgnite Dashboard',
})

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
	}
])

const showAddDeviceModal = ref(false)
const editingDevice = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')

const deviceForm = ref({
	name: '',
	type: '',
	description: '',
	ipAddress: '',
	macAddress: ''
})

// Computed properties
const totalDevices = computed(() => devices.value.length)
const onlineDevices = computed(() => devices.value.filter(d => d.status === 'online').length)
const standbyDevices = computed(() => devices.value.filter(d => d.status === 'standby').length)
const offlineDevices = computed(() => devices.value.filter(d => d.status === 'offline').length)

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
.dashboard-page {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
	min-height: 100vh;
}

.dashboard-header {
	background-color: rgba(0, 0, 0, 0.2);
}

.stats-section {
	background-color: #1a1b2e;
}

.devices-section {
	background-color: #1a1b2e;
}

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

.dropdown-menu-dark {
	background-color: #0b0c1b;
	border-color: rgba(255, 255, 255, 0.1);
}

.dropdown-item:hover {
	background-color: rgba(255, 255, 255, 0.1);
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