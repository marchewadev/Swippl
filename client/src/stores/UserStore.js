import { defineStore } from "pinia";
import { useModalStore } from "./ModalStore";
// import { createNewUser } from "@/firebase/AuthService";

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
    isUserLoggedIn: true,
  }),
  actions: {
    signUpUser(router, { name, email, password, gender, dateOfBirth }) {
      // We use the router instance and pass it to the closeModalAndRedirect method
      // to redirect the user to the Settings page after they successfully sign up.

      // createNewUser(name, email, password, gender, dateOfBirth);
      this.isUserLoggedIn = true;
      this.closeModalAndRedirect(router, "Settings");
    },
    signInUser() {
      this.isUserLoggedIn = true;
    },
    logoutUser() {
      this.isUserLoggedIn = false;
    },
    closeModalAndRedirect(router, path) {
      const modalStore = useModalStore();
      modalStore.closeModal();
      router.push({ name: path });
    },
  },
  getters: {
    userAvatar() {
      return this.user.avatar || "/src/assets/avatar.png";
    },
  },
});
