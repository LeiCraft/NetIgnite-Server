<template>
    <div class="app">
        <Sidebar class="sidebar">
            <main class="content">
                <slot />
            </main>
        </Sidebar>
        <Footer :withMargin="false" />
    </div>

</template>

<script setup lang="ts">
    import Sidebar from '~/components/dashboard/Sidebar.vue';
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

.sidebar {
    /* margin-top: 6rem; */
    flex-grow: 1;

}

.content {
    display: flex;
    flex-direction: column;
    height: 100%;
}

</style>