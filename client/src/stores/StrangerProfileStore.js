import { defineStore } from "pinia";

export const useStrangerProfileStore = defineStore("strangerProfileStore", {
  state: () => ({
    show: false,
  }),
  actions: {
    openProfile() {
      this.show = true;
    },
    closeProfile() {
      this.show = false;
    },
  },
});
