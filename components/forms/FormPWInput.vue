
<script setup lang="ts">

import { ref, watch } from 'vue'

const props = defineProps({
	modelValue: {}
})
const emit = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue)

defineOptions({
  	inheritAttrs: false
});

watch(() => props.modelValue, val => {
	internalValue.value = val
})

watch(internalValue, val => {
	emit('update:modelValue', val)
});

const showPassword = ref(false);

</script>


<template>
	<div class="password-input-container">
		<input :type="showPassword ? 'text' : 'password'" class="form-control form-input" v-bind="$attrs" v-model="internalValue">
		<span class="password-toggle" @click="showPassword = !showPassword">
			<i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
		</span>
	</div>
</template>

<style scoped>

@import "/assets/css/forms.css";

.password-input-container {
	position: relative;
}
.password-toggle {
	position: absolute;
	right: 10px;
	top: 50%;
	transform: translateY(-50%);
	cursor: pointer;
	color: white;
	opacity: 0.7;
}

</style>