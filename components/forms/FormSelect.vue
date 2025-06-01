
<script setup lang="ts">

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

function updateValue(e: any) {
  emit('update:modelValue', e.target.value)
}

</script>


<template>
    <select class="form-select form-input" @input="updateValue">
        <slot></slot>
    </select>
</template>

<style scoped>

@import "/assets/css/forms.css";

</style>