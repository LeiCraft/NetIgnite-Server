<script setup lang="ts">



</script>


<template>
    <div class="table-container rounded-4 overflow-hidden mb-4">
        <table class="table table-dark table-hover mb-0">
            <slot></slot>
        </table>
    </div>
</template>


<style scoped>

.table-container {
    background-color: #0b0c1b;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.table {
    margin-bottom: 0;
}

.table-dark {
    --bs-table-bg: transparent;
    --bs-table-striped-bg: rgba(255, 255, 255, 0.05);
    --bs-table-hover-bg: rgba(255, 255, 255, 0.1);
}

</style>