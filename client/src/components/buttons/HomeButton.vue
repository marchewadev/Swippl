<template>
  <a
    href="#"
    class="text-base p-4 rounded-md transition-all duration-300 inline-block hover:-translate-y-0.5"
    @click="handleClick"
    >{{ text }}</a
  >
</template>

<script setup>
const props = defineProps({
  text: String,
});

const emit = defineEmits(["click"]);

const handleClick = () => {
  emit("click");
};
</script>
