<template>
  <transition name="modal">
    <div
      class="bg-white p-6 rounded-md shadow-md shadow-black/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 max-w-sm"
      v-if="modalStore.show && modalName === modalStore.selectedModal"
      v-on-click-outside="modalStore.closeModal"
    >
      <div class="mb-8 relative">
        <h2 class="text-lg text-center uppercase">{{ modalTitle }}</h2>
        <button
          class="absolute left-full top-full -translate-x-full -translate-y-full transition-colors duration-300 hover:text-red-700"
          @click="modalStore.closeModal"
        >
          <ion-icon name="close-outline" class="text-2xl"></ion-icon>
        </button>
      </div>
      <slot></slot>
    </div>
  </transition>
</template>

<script setup>
import { vOnClickOutside } from "@vueuse/components";
import { useModalStore } from "@/stores/ModalStore";
const modalStore = useModalStore();

const props = defineProps({
  modalTitle: String,
  modalName: String,
});
</script>

<style scoped>
/* Slide animation for the modal */
.modal-enter-active {
  animation: slideDown 0.5s;
}

.modal-leave-active {
  animation: slideDown 0.5s reverse;
}

@keyframes slideDown {
  0% {
    top: 0%;
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
