<template>
    <div class="container-xxl auth-wrapper">
        <div class="auth-container d-flex flex-column justify-content-center align-items-center">

            <div class="text-center h3 mt-2 mb-3">Welcome to NetIgnite</div>
            <div class="text-center h6 text-secondary mb-5">Login to your account</div>
            <form class="w-100" @submit.prevent="loginForm.submit">
                <FormGroup>
                    <FormLabel for="username">Username:</FormLabel>
                    <FormInput id="username" v-model="loginForm.values.username" placeholder="Enter your username"
                        required />
                </FormGroup>
                <FormGroup>
                    <label for="password" class="mb-1">Password:</label>
                    <FormInput type="password" id="password" v-model="loginForm.values.password"
                        placeholder="Enter your password" required />
                </FormGroup>
                <FormsFormSubmitBtn class="submit-btn">Login</FormsFormSubmitBtn>
            </form>
        </div>
    </div>

</template>

<script setup lang="ts">

useSeoMeta({
    title: "Login | NetIgnite",
    description: "Login to your NetIgnite account",
});
definePageMeta({
    layout: "auth",
    middleware: "auth",
});

import { ref } from 'vue'
import FormGroup from '~/components/forms/FormGroup.vue';
import FormLabel from '~/components/forms/FormLabel.vue';
import FormInput from '~/components/forms/FormInput.vue';

import { SimpleForm } from '~/utils/simpleForm';

const route = useRoute()
const redirectUrl = route.query.url || '/';

const loginForm = new SimpleForm(
    {
        username: "",
        password: "",
    },

    async function (values) {

        try {
            const response = await $fetch('/api/auth/login', {
                method: 'POST',
                body: values,
                credentials: 'include',
            });

            loginForm.reset();

            if (response.status !== 'OK') {
                useNotificationToast({
                    message: "Login failed: " + (response?.message || 'Unknown error'),
                    type: 'error',
                });

            }

            useNotificationToast({
                message: "Login successful! Redirecting...",
                type: 'success',
            });

            navigateTo(redirectUrl as string);

            return;

        } catch (error) {

            useNotificationToast({
                message: "Login failed: " + (error as Error).message,
                type: 'error',
            });
        }
        
    }
);


</script>

<style scoped>
.auth-wrapper {
    margin: auto;
    max-width: 500px;
}

.auth-container {
    width: 100%;
    padding: 30px;
    background-color: #1a1b2e;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.submit-btn {
    width: 100%;
}

.alert-message-box {
    max-width: 500px;
    position: fixed;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1050;
    /* above most Bootstrap elements */
    min-width: 300px;
    text-align: center;
}

.alert-message {
    background-color: rgba(255, 255, 255, 0.85);
    /* white with transparency */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    padding: 1rem 1.5rem;
    border-radius: 0.375rem;
    text-align: center;
}
</style>
