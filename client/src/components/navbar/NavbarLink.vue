<template>
  <li>
    <a
      href="#"
      class="p-2 hover:text-gray-50 hover:bg-primary hover:transition-colors duration-150 rounded-md"
      @click="handleClick"
    >
      {{ linkTitle }}
    </a>
  </li>
</template>

<script setup>
const props = defineProps({
  linkTitle: String,
});

const emit = defineEmits(["click"]);

const handleClick = () => {
  emit("click");
};
</script>
