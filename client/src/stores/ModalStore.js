import { defineStore } from "pinia";

export const useModalStore = defineStore("modalStore", {
  state: () => ({
    show: false,
    showMessageModal: false,
    isErrorMessageModal: false,
    selectedModal: "",
    textMessageModal: "",
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
    displayMessageModal(message, isErrorMessage = false) {
      this.showMessageModal = true;
      this.textMessageModal = message;
      this.isErrorMessageModal = isErrorMessage;
    },
    closeMessageModal() {
      this.showMessageModal = false;
      this.textMessageModal = "";
      this.isErrorMessageModal = false;
    },
  },
});
