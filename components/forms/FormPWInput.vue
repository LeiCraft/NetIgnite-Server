
<script setup lang="ts">

import { ref, watch } from 'vue'

const props = defineProps({
	modelValue: {}
})
const emit = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue)

watch(() => props.modelValue, val => {
	internalValue.value = val
})

watch(internalValue, val => {
	emit('update:modelValue', val)
});

</script>


<template>
    <input type="password" class="form-control form-input" v-model="internalValue">
</template>

<style scoped>

@import "/assets/css/forms.css";

</style>