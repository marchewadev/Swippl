<template>
  <button
    class="text-xs text-gray-50 bg-primary p-2 rounded-md transition-colors duration-300 min-[1200px]:text-sm min-[1330px]:text-base"
    :class="{
      'opacity-50': !isValid,
      'hover:bg-primaryLight active:bg-primaryLight': isValid && !isRed,
      'bg-red-700': isRed,
      'hover:bg-red-600 active:bg-red-600': isValid && isRed,
    }"
    :disabled="!isValid"
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

  isRed: {
    type: Boolean,
    default: false,
  },
});
</script>
