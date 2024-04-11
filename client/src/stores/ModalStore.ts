import { defineStore } from "pinia";

export const useModalStore = defineStore("modalStore", {
  state: () => ({
    showModal: false,
    showMessageModal: false,
    isErrorMessageModal: false,
    selectedModal: "",
    textMessageModal: "",
  }),
  actions: {
    openModal(selectedModal: string) {
      this.showModal = true;
      this.selectedModal = selectedModal;
    },
    closeModal() {
      this.showModal = false;
      this.selectedModal = "";
    },
    displayMessageModal(message: string, isErrorMessage = false) {
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
