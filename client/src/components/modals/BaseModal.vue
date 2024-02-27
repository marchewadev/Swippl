<template>
  <transition name="modal">
    <div
      class="bg-white p-6 rounded-md shadow-md shadow-black/10 max-h-4/5 max-w-sm overflow-y-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 max-[500px]:min-w-4/5"
      v-if="showModal && modalName === selectedModal"
      v-on-click-outside="closeModal"
    >
      <div class="mb-8 relative">
        <h2 class="text-base text-center uppercase min-[1330px]:text-lg">
          {{ modalTitle }}
        </h2>
        <button
          class="absolute left-full top-full -translate-x-full -translate-y-full transition-colors duration-300 hover:text-red-700"
          @click="closeModal"
        >
          <ion-icon
            name="close-outline"
            class="text-xl min-[1330px]:text-2xl"
          ></ion-icon>
        </button>
      </div>
      <slot></slot>
    </div>
  </transition>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useModalStore } from "@/stores/ModalStore";
import { vOnClickOutside } from "@vueuse/components";

const modalStore = useModalStore();

const { closeModal } = modalStore;
const { showModal, selectedModal } = storeToRefs(modalStore);

const props = defineProps({
  modalTitle: {
    type: String,
    required: true,
  },

  modalName: {
    type: String,
    required: true,
  },
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
