<template>
  <transition name="modal">
    <div
      class="message-modal bg-white rounded-tl-md rounded-tr-md absolute left-1/2 top-10 -translate-x-1/2 z-20"
      v-if="showMessageModal"
    >
      <p
        class="tracking-wide text-xs p-3 min-[1330px]:text-sm min-[1330px]:p-4"
      >
        {{ textMessageModal }}
      </p>
      <div class="empty-bar bg-gray-400 h-1 w-full">
        <div
          class="progess-bar h-full"
          :class="isErrorMessageModal ? 'bg-red-600' : 'bg-emerald-600'"
          :style="{ width: `${width}%` }"
        ></div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useModalStore } from "@/stores/ModalStore";

const width = ref(100);
const intervalId = ref(null);

const modalStore = useModalStore();
const { showMessageModal, textMessageModal, isErrorMessageModal } =
  storeToRefs(modalStore);

const decreaseWidth = () => {
  if (width.value > 0) {
    width.value -= 0.5;
  } else {
    modalStore.closeMessageModal();
  }
};

watch(
  () => [modalStore.showMessageModal, modalStore.textMessageModal],
  (show) => {
    if (show) {
      clearInterval(intervalId.value);
      width.value = 100;
      intervalId.value = setInterval(decreaseWidth, 10);
    } else {
      clearInterval(intervalId.value);
      width.value = 100;
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.message-modal {
  box-shadow: 1px 3px 10px 1px rgba(0, 0, 0, 0.2);
}

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
