<template>
  <label :for="labelFor" class="text-sm mb-1 block min-[1330px]:text-base">
    <slot></slot>
  </label>
</template>

<script setup>
const props = defineProps({
  labelFor: {
    type: String,
    required: true,
  },
});
</script>
