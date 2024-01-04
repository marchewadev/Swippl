<template>
  <router-link
    :to="path"
    class="text-base p-4 rounded-md transition-all duration-300 inline-block hover:-translate-y-0.5"
    @click="handleClick"
  >
    {{ text }}
  </router-link>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["click"]);

const handleClick = () => {
  emit("click");
};
</script>
