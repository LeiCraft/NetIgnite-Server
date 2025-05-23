<template>
    <div class="container-xxl error-wrapper">
        <h1 class="text-center">Error {{ (error as any).statusCode }}</h1>
    </div>
</template>

<script setup lang="ts">

import type { NuxtError } from '#app';

const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })

definePageMeta({
    layout: 'default'
});

useSeoMeta({
    title: `Error ${(props.error as any).statusCode} | NetIgnite`,
    description: 'An error occurred while processing your request.',
});

</script>

<style scoped>

.error-wrapper {
    margin: auto;
    max-width: 500px;
}

</style>