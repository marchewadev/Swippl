<template>
  <router-link
    class="text-xs p-2 rounded-md transition-all duration-300 inline-block hover:-translate-y-0.5 min-[1200px]:text-base min-[1600px]:p-4"
    :to="path"
    @click="handleClick"
  >
    {{ text }}
  </router-link>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    required: true,
  },

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
