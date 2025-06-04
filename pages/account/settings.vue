<script setup lang="ts">
import { computed } from 'vue'
import FormDescription from '~/components/forms/FormDescription.vue';
import FormGroup from '~/components/forms/FormGroup.vue';
import FormInput from '~/components/forms/FormInput.vue';
import FormLabel from '~/components/forms/FormLabel.vue';
import FormSubmitBtn from '~/components/forms/FormSubmitBtn.vue';
import { useAPI } from '~/composables/useAPI';

definePageMeta({
    layout: 'dashboard',
    middleware: 'auth',
});


const userInfo = structuredClone(toRaw(SessionStore.useUserInfo()));

const newPassword = ref('');

async function sumbitForm() {

    try {

        const response = await useAPI(`/api/account/${userInfo.userID}`, {
            method: 'PUT',
            body: JSON.stringify({
                ...userInfo,
                password: newPassword.value || undefined
            })
        });

        if (response.status !== "OK") {
            useNotificationToast({
                message: `Error updating Account: ${response?.message || 'unknown error'}`,
                type: 'error'
            });
            return;
        }
        useNotificationToast({
            message: 'Account updated successfully',
            type: 'success'
        });

        SessionStore.setUserInfo(userInfo);


    } catch (error) {
        useNotificationToast({
            message: `Error: ${error instanceof Error ? error.message : 'unknown error'}`,
            type: 'error'
        });
    }

}

const isSubmitDisabled = computed(() => {
    return !userInfo.username;
});

</script>

<template>

    <DashboardPage title="Account Settings" subtitle="Manage your account settings" image="bi bi-gear">

        <form @submit.prevent="sumbitForm" autocomplete="off">

            <div class="box-container d-flex flex-column justify-content-center">

                <h4 class="text-white mb-4">Your Account Details</h4>

                <div class="row">
                    <FormGroup class="col-md-6">
                        <FormLabel>Username</FormLabel>
                        <FormInput v-model="userInfo.username" placeholder="Enter your username" required />
                        <FormDescription>
                            This is your unique username for logging in.
                        </FormDescription>
                    </FormGroup>
                    <FormGroup class="col-md-6">
                        <FormLabel>Update Password</FormLabel>
                        <FormInput type="password" v-model="newPassword" placeholder="Enter new password (optional)" />
                        <FormDescription>
                            You can update your password here. Leave it blank to keep the current password.
                        </FormDescription>
                    </FormGroup>
                </div>

                <div class="d-flex justify-content-end mt-4">
                    <FormSubmitBtn class="btn btn-primary text-right" type="submit" :disabled="isSubmitDisabled">
                        Update Account
                    </FormSubmitBtn>
                </div>

            </div>

        </form>

    </DashboardPage>

</template>
