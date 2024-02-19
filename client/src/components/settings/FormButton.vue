<template>
  <button
    class="rounded-md bg-primary text-gray-50 transition-colors duration-300 min-[1330px]:text-base text-sm p-2"
    :disabled="!isValid"
    :class="{
      'opacity-50': !isValid,
      'hover:bg-primaryLight': isValid && !isRed,
      'bg-red-700': isRed,
      'hover:bg-red-600': isValid && isRed,
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
  isRed: {
    type: Boolean,
    default: false,
  },
});
</script>
