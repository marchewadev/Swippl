<template>
  <router-link
    class="text-lg border-b border-gray-300 px-4 py-2 transition-colors duration-150 active:bg-primary active:text-gray-50"
    :to="path"
    @click="handleClick"
  >
    <slot></slot>
  </router-link>
</template>

<script setup lang="ts">
defineProps({
  path: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["click"]);

const handleClick = () => {
  emit("click");
};
</script>
