import { defineStore } from "pinia";

export const useModalStore = defineStore("modalStore", {
  state: () => ({
    show: false,
    selectedModal: "",
  }),
  actions: {
    openModal(selectedModal) {
      this.show = true;
      this.selectedModal = selectedModal;
    },
    closeModal() {
      this.show = false;
      this.selectedModal = "";
    },
  },
});
