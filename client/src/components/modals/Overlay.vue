<template>
  <transition name="overlay">
    <div
      class="overlay w-full h-full backdrop-blur-sm bg-black/20 absolute top-0 left-0 z-10"
      v-if="modalStore.show"
    ></div>
  </transition>
</template>

<script setup>
import { useModalStore } from "@/stores/ModalStore";
const modalStore = useModalStore();
</script>

<style scoped>
/* Fade-in animation for the overlay (blur) */
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.overlay-enter-to,
.overlay-leave-from {
  opacity: 1;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: all 0.3s ease;
}
</style>
