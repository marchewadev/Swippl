<template>
  <input
    :type="type || 'text'"
    :class="[
      type !== 'checkbox' && type !== 'file'
        ? 'text-xs bg-gray-100 border border-gray-300 p-2 rounded-md w-full min-[1330px]:text-sm'
        : '',
      customClass,
    ]"
    :placeholder="placeholder"
    :id="inputId"
    v-model="value"
    v-bind="inputProps"
  />
  <p
    class="text-xs text-red-600 mt-1"
    :class="customErrorClass"
    v-if="errorMessage"
  >
    * {{ errorMessage }}
  </p>
</template>

<script setup lang="ts">
import { useField } from "vee-validate";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },

  type: {
    type: String,
  },

  inputId: {
    type: String,
    required: true,
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
