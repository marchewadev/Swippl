<template>
  <select
    v-model="value"
    :class="[
      'text-sm bg-gray-100 border border-gray-300 rounded p-2 mt-1 block cursor-pointer',
      customClass,
    ]"
  >
    <slot name="values"></slot>
  </select>

  <p v-if="errorMessage">{{ errorMessage }}</p>
</template>

<script setup>
import { useField } from "vee-validate";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  initialValue: {
    type: String,
    required: true,
  },
  customClass: {
    type: String,
    default: "",
  },
});

const { value, errorMessage } = useField(() => props.name);

// Set initial value
value.value = props.initialValue;
</script>
