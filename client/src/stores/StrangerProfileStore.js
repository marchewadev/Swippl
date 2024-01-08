import { defineStore } from "pinia";

export const useStrangerProfileStore = defineStore("strangerProfileStore", {
  state: () => ({
    stranger: {
      id: null,
      name: "",
      gender: "",
      dateOfBirth: "",
      city: "",
      avatar: "",
    },
    isFriend: false,
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
  getters: {
    getAvatar() {
      return this.stranger.avatar || "/src/assets/avatar.png";
    },
  },
});
