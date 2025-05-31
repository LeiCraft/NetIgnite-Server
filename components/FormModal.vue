<script setup lang="ts">
import { SimpleForm } from '../utils/simpleForm';


defineProps({
    settings: {
        type: FormModal,
        required: true
    }
})


const showAddDeviceModal = ref(false);
const editingDevice = ref(null);

const deviceForm = new SimpleForm(
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

</script>

<template>

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
                                <input type="text" class="form-control form-input" v-model="deviceForm.values.name"
                                    required>
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
                                <textarea class="form-control form-input" rows="2"
                                    v-model="deviceForm.values.description"></textarea>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">IP Address</label>
                                <input type="text" class="form-control form-input" v-model="deviceForm.values.ipAddress"
                                    pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">MAC Address</label>
                                <input type="text" class="form-control form-input font-monospace"
                                    v-model="deviceForm.values.macAddress"
                                    pattern="^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$" placeholder="AA:BB:CC:DD:EE:FF"
                                    required>
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

</template>

<style scoped>

@import url('/assets/forms.css');

.device-modal {
    background-color: #1a1b2e;
    /* border: 1px solid rgba(255, 255, 255, 0.1); */
}

.modal-backdrop {
    background-color: rgba(0, 0, 0, 0.8);
}

</style>