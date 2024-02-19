<template>
  <router-link
    :to="path"
    class="rounded-md transition-all duration-300 inline-block hover:-translate-y-0.5 min-[900px]:p-2 min-[1600px]:p-4 min-[1200px]:text-base text-xs p-2"
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
