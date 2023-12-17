<template>
  <div
    class="text-center py-12 px-6 rounded-md shadow-lg shadow-black/20 transition-transform duration-300 hover:-translate-y-0.5"
  >
    <ion-icon :name="iconName" class="text-3xl mb-1"></ion-icon>
    <p class="text-xl mb-2">{{ cardTitle }}</p>
    <p class="text-base tracking-tight"><slot></slot></p>
  </div>
</template>

<script setup>
const props = defineProps({
  iconName: String,
  cardTitle: String,
});
</script>
