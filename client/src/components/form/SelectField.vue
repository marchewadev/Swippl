<template>
  <select
    v-model="value"
    class="text-sm bg-gray-100 border border-gray-30 rounded p-2 mt-1 block cursor-pointer"
  >
    <slot name="values"></slot>
  </select>

  <p v-if="errorMessage">{{ errorMessage }}</p>
</template>

<script setup>
import { useField } from "vee-validate";

const props = defineProps({
  name: String,
  initialValue: String,
});

const { value, errorMessage } = useField(() => props.name);

// Set initial value
value.value = props.initialValue;
</script>
