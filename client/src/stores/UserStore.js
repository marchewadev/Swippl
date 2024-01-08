import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: {
      id: null,
      name: "",
      email: "",
      password: "",
      gender: "",
      dateOfBirth: "",
      city: "",
      avatar: "",
    },
    blockedUsers: [],
    friends: [],
    isUserLoggedIn: false,
  }),
  actions: {
    logout() {
      this.isUserLoggedIn = false;
    },
    login() {
      this.isUserLoggedIn = true;
    },
  },
  getters: {
    userAvatar() {
      return this.user.avatar || "/src/assets/avatar.png";
    },
  },
});
