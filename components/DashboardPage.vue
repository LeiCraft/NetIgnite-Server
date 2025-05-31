<script setup lang="ts">

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
});

// SEO Meta
useSeoMeta({
    title: `${props.title} | NetIgnite`,
    description: props.subtitle,
});

</script>

<template>
    <div class="container">

        <!-- Header -->
        <div class="py-4">
            <div class="row align-items-center">
                <div class="col-lg-6">
                    <h1 class="display-6 fw-bold text-white mb-2">
                        <i :class="image" class="text-primary me-3"></i>
                        {{ title }}
                    </h1>
                    <p class="text-light opacity-75 mb-0">
                        {{ subtitle }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Body -->
        <div>
            <slot></slot>
        </div>

    </div>
</template>

<style>

@import '/assets/forms.css';


</style>