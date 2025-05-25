<template>
    <div class="app">
        <!-- <Header /> -->
        <main class="content">
            <slot />
        </main>
        <Footer />
    </div>

</template>

<script setup lang="ts">
// import Header from '~/components/header/Header.vue';
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

</style>