<script setup lang="ts">
import { FormModalHandler } from '@/utils/handlers/formModal';

const { handler: modalHandler } = defineProps({
    handler: {
        type: Object,
        required: true
    }
}) as { handler: FormModalHandler<any> };

if (!modalHandler || !(modalHandler instanceof FormModalHandler)) {
    throw new Error('Invalid handler provided to FormModal component');
}

async function submit() {
    await modalHandler.form.submit();
    closeModal();
}

function closeModal() {

    if (modalHandler.settings.onModalClose) {
        modalHandler.settings.onModalClose();
    }

    modalHandler.hideModal();
    modalHandler.form.reset();
}

</script>

<template>

    <div class="modal fade" :class="{ show: handler.isModalVisible }"
        :style="{ display: handler.isModalVisible ? 'block' : 'none' }" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content border-secondary form-modal">
                <div class="modal-header border-secondary">
                    <h5 class="modal-title text-white">
                        <i v-if="handler.settings.header.icon" :class="handler.settings.header.icon" class="text-primary me-2"></i>
                        {{ handler.settings.header.title }}
                    </h5>
                    <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
                </div>
                <div class="modal-body text-light">
                    <form>
                        <slot></slot>
                    </form>
                </div>
                <div class="modal-footer border-secondary">
                    <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
                    <button type="button" class="btn btn-primary text-dark fw-bold" @click="submit">
                        <i class="bi bi-check-circle me-2"></i>
                        {{ handler.settings.submitText }}
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div v-if="handler.isModalVisible" class="modal-backdrop fade show"></div>

</template>

<style scoped>

@import url('/assets/forms.css');

.form-modal {
    background-color: #1a1b2e;
    /* border: 1px solid rgba(255, 255, 255, 0.1); */
}

.modal-backdrop {
    background-color: rgba(0, 0, 0, 0.8);
}

</style>