<template>
  <button
    class="text-base p-2 rounded-md bg-primary text-gray-50 transition-colors duration-300"
    :disabled="!isValid"
    :class="{
      'opacity-50': !isValid,
      'hover:bg-primaryLight': isValid,
    }"
    :form="formId"
  >
    {{ buttonTitle }}
  </button>
</template>

<script setup>
import { useIsFormValid } from "vee-validate";
const isValid = useIsFormValid();

const props = defineProps({
  formId: {
    type: String,
    required: true,
  },
  buttonTitle: {
    type: String,
    required: true,
  },
});
</script>
