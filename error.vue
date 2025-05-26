<template>
    <div class="app">
        <!-- <Header /> -->
        <main class="content">
            <div class="container-xxl error-wrapper">
                <h1 class="text-center">Error {{ (error as any).statusCode }}</h1>
            </div>
        </main>
        <Footer />
    </div>
</template>

<script setup lang="ts">

import type { NuxtError } from '#app';
import Footer from '@/components/Footer.vue';

const props = defineProps({
    error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })

useSeoMeta({
    title: `Error ${(props.error as any).statusCode} | NetIgnite`,
    description: 'An error occurred while processing your request.',
});

</script>

<style scoped>

.app {
    font-family: "Rubik", sans-serif;
    background-color: #0b0c1b;
    color: white;
    font-size: 16px;
    margin: 0;
    padding: 0;
    min-height: 100vh;
    word-wrap: break-word;
    display: flex;
    flex-direction: column;
}

.content {
    margin-top: 6rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.error-wrapper {
    margin: auto;
    max-width: 500px;
}
</style>


