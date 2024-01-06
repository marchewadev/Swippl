<template>
  <input
    v-model="value"
    v-bind="inputProps"
    :type="type || 'text'"
    :class="[
      type !== 'checkbox' && type !== 'file'
        ? 'text-sm p-2 rounded-md bg-gray-100 border border-gray-300 w-full'
        : '',
      customClass,
    ]"
    :placeholder="placeholder"
  />
  <p
    v-if="errorMessage"
    class="text-xs mt-1 text-red-600"
    :class="customErrorClass"
  >
    * {{ errorMessage }}
  </p>
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
  customClass: {
    type: String,
    default: "",
  },
  customErrorClass: {
    type: String,
    default: "",
  },
  inputProps: {
    type: Object,
    default: () => ({}),
  },
});

const { value, errorMessage } = useField(() => props.name);
</script>

<style scoped>
/* Used inside the RegisterModal.vue component */
.error-message-grid {
  grid-column: 2;
  grid-row: 2;
}
</style>
