<template>
  <select
    v-model="value"
    :class="[
      'text-sm bg-gray-100 border border-gray-300 rounded p-2 mt-1 block cursor-pointer',
      customClass,
    ]"
    @change="handleChange"
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

const emits = defineEmits(["change"]);

const handleChange = () => {
  emits("change", value);
};

const { value, errorMessage } = useField(() => props.name);

// Set initial value
value.value = props.initialValue;
</script>
