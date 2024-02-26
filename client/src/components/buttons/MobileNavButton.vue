<template>
  <router-link
    :to="path"
    class="text-lg border-b border-gray-300 px-4 py-2 transition-colors duration-150 active:bg-primary active:text-gray-50"
    @click="handleClick"
  >
    <slot></slot>
  </router-link>
</template>

<script setup>
const props = defineProps({
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
