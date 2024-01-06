<template>
  <input
    v-model="value"
    :type="type || 'text'"
    class="text-sm p-2 rounded-md bg-gray-100 border border-gray-300 w-full"
    :placeholder="placeholder"
  />
  <p v-if="errorMessage">{{ errorMessage }}</p>
</template>

<script setup>
import { useField } from "vee-validate";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
  placeholder: {
    type: String,
  },
});

const { value, errorMessage } = useField(() => props.name);
</script>
