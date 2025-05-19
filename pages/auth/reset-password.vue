<template>
    <div></div>
</template>

<script setup lang="ts">

useSeoMeta({
    title: 'Reset Password | NetIgnite',
    description: 'Reset your password of your NetIgnite account',
});
definePageMeta({
    layout: 'auth',
    middleware: 'auth',
});

</script>