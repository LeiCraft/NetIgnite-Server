<template>
    <div class="app">
        <Sidebar class="sidebar">
            <main class="content">
                <div class="flex-grow-1">
                    <slot />
                </div>
                <Footer :withMargin="true" />
            </main>
        </Sidebar>
    </div>

</template>

<script setup lang="ts">
    import Sidebar from '@/components/Sidebar.vue';
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
    min-height: 100%;
}

</style>

<style>

.box-container {
    width: 100%;
    padding: 30px;
    background-color: #1a1b2e;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;
}


</style>