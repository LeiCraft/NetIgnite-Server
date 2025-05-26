<template>
    <div class="container-xxl auth-wrapper">
        <div class="auth-container d-flex flex-column justify-content-center align-items-center">

            <div v-if="alertMessage" class="w-100 text-center mb-4 container-xxl alert-message-box">
                <div :class="['alert', alertType]" class="alert-message">
                    {{ alertMessage }}
                </div>
            </div>

            <div class="text-center h3 mt-2 mb-3">Welcome to NetIgnite</div>
            <div class="text-center h6 text-secondary mb-5">Login to your account</div>
            <form class="w-100" @submit.prevent="handleLogin">
                <div class="form-group mb-3">
                    <label for="username" class="mb-1">Username:</label>
                    <input type="text" class="form-control form-input" id="username" v-model="username"
                        placeholder="Enter your username" required>
                </div>
                <div class="form-group mb-3">
                    <label for="password" class="mb-1">Password:</label>
                    <input type="password" class="form-control form-input" id="password" v-model="password"
                        placeholder="Enter your password" required>
                </div>
                <button type="submit" class="btn btn-primary btn-block submit-btn">Login</button>
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

const username = ref('')
const password = ref('')
const alertMessage = ref('')
const alertType = ref('')


const handleLogin = async () => {
    alertMessage.value = ''
    alertType.value = ''

    const { data, error } = await useFetch('/api/user/auth/login', {
        method: 'POST',
        body: {
            username: username.value,
            password: password.value,
        },
        credentials: 'include',
    });

    username.value = ''
    password.value = ''

    if (error.value) {
        alertMessage.value = error.value.data?.message || 'Login failed'
        alertType.value = 'alert-danger'
        return
    }

    if (data.value?.status === 'OK') {
        alertMessage.value = 'Login successful!'
        alertType.value = 'alert-success'
        navigateTo('/');
    } else {
        alertMessage.value = data.value?.message || 'Invalid login'
        alertType.value = 'alert-danger'
    }
}

</script>

<style scoped>

@import '/assets/forms.css';

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
    z-index: 1050;      /* above most Bootstrap elements */
    min-width: 300px;
    text-align: center;
}

.alert-message {
    background-color: rgba(255, 255, 255, 0.85); /* white with transparency */
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    padding: 1rem 1.5rem;
    border-radius: 0.375rem;
    text-align: center;
}

</style>
