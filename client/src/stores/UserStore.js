import axios from "axios";
import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { useModalStore } from "./ModalStore";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: {
      id: null,
      name: "",
      birthdate: "",
      city: "",
      avatar: "",
    },
    blockedUsers: [],
    friends: [],
    token: useStorage("token", null),
  }),
  actions: {
    async signUpUser(router, userJSON) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_SERVER}/user/register`,
          userJSON
        );

        this.token = response.data.userObject.token;

        this.closeModalAndRedirect(router, "Settings");
      } catch (err) {
        console.error(err.response.data);
      }
    },
    async signInUser(router, userJSON) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_SERVER}/user/login`,
          userJSON
        );

        this.token = response.data.userObject.token;

        this.closeModalAndRedirect(router, "Settings");
      } catch (err) {
        console.error(err.response.data);
      }
    },
    async updateUserProfile(userJSON) {
      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_BACKEND_SERVER}/user/update/profile`,
          userJSON,
          { headers: { Authorization: `Bearer ${this.token}` } }
        );
      } catch (err) {
        console.error(err.response.data);
      }
    },
    async updateUserEmail(router, userJSON) {
      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_BACKEND_SERVER}/user/update/email`,
          userJSON,
          { headers: { Authorization: `Bearer ${this.token}` } }
        );

        this.resetUserStore();
        router.push({ name: "Home" });
      } catch (err) {
        console.error(err.response.data);
      }
    },
    async updateUserPassword(router, userJSON) {
      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_BACKEND_SERVER}/user/update/password`,
          userJSON,
          { headers: { Authorization: `Bearer ${this.token}` } }
        );

        this.resetUserStore();
        router.push({ name: "Home" });
      } catch (err) {
        console.error(err.response.data);
      }
    },
    async deleteUserAccount(router, userJSON) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_BACKEND_SERVER}/user/delete`,
          {
            data: userJSON,
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );

        this.resetUserStore();
        router.push({ name: "Home" });
      } catch (err) {
        console.error(err.response.data);
      }
    },
    setUserData(userObject) {
      const { id, name, birthdate, city } = userObject;

      this.user.id = id;
      this.user.name = name;
      this.user.birthdate = birthdate;
      if (city) {
        this.user.city = city;
      }
    },
    resetUserStore() {
      this.$reset();
      this.token = null;
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
    checkIfUserIsLoggedIn() {
      return this.token !== null;
    },
  },
});
