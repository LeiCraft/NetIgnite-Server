
<script setup lang="ts">

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

function updateValue(e: any) {
  emit('update:modelValue', e.target.value)
}

</script>


<template>
    <textarea class="form-control form-input" @input="updateValue">{{ modelValue }}</textarea>
</template>

<style scoped>

@import "/assets/css/forms.css";

</style>