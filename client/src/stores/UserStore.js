import { defineStore } from "pinia";
import { useModalStore } from "./ModalStore";
import { useStorage } from "@vueuse/core";
import axios from "axios";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: {
      id: null,
      name: "",
      birthdate: "",
      city: "",
      gender: "",
      avatar: "",
    },
    token: useStorage("token", null),
    friends: [],
    searchCriteria: useStorage("searchCriteria", {
      ageRangeSearch: [18, 100],
      genderSearch: "any",
    }),
  }),
  actions: {
    async performUserAction(action, router, userJSON) {
      // Helper function to perform user actions such as register and login. The only difference is the URL.

      try {
        const url = action === "register" ? "register" : "login";

        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_SERVER}/user/${url}`,
          userJSON
        );

        this.token = response.data.userObject.token;

        this.closeModalAndRedirect(router, "Settings");
        this.displayMessageModal(response.data.message);
      } catch (err) {
        this.displayMessageModal(err.response.data.message, true);
      }
    },
    async performUserUpdateAction(url, router, userJSON) {
      // Helper function to perform user update actions such as updating the user's email and password, both of which require reauthentication.

      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_BACKEND_SERVER}/user/update/${url}`,
          userJSON,
          { headers: { Authorization: `Bearer ${this.token}` } }
        );

        this.resetUserStore();
        router.push({ name: "Home" });

        this.displayMessageModal(response.data.message);
      } catch (err) {
        this.displayMessageModal(err.response.data.message, true);
      }
    },
    async signUpUser(router, userJSON) {
      await this.performUserAction("register", router, userJSON);
    },
    async signInUser(router, userJSON) {
      await this.performUserAction("login", router, userJSON);
    },
    async updateUserEmail(router, userJSON) {
      await this.performUserUpdateAction("email", router, userJSON);
    },
    async updateUserPassword(router, userJSON) {
      await this.performUserUpdateAction("password", router, userJSON);
    },
    async updateUserProfile(userJSON) {
      try {
        const formData = new FormData();
        for (const key in userJSON) {
          formData.append(key, userJSON[key]);
        }

        const response = await axios.patch(
          `${import.meta.env.VITE_BACKEND_SERVER}/user/update/profile`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.response.avatarURL) {
          this.user.avatar = response.data.response.avatarURL;
        }

        this.displayMessageModal(response.data.message);
      } catch (err) {
        this.displayMessageModal(err.response.data.message, true);
      }
    },
    async deleteUserAvatar() {
      this.user.avatar = "";
    },
    async deleteUserAccount(router, userJSON) {
      // TODO: rozważyć podłączenie pod funkcję performUserUpdateAction
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

        this.displayMessageModal(response.data.message);
      } catch (err) {
        this.displayMessageModal(err.response.data.message, true);
      }
    },
    setUserData(userObject) {
      const { id, name, birthdate, city, gender, avatar } = userObject;

      this.user.id = id;
      this.user.name = name;
      this.user.birthdate = birthdate;
      this.user.gender = gender;
      if (city) {
        this.user.city = city;
      }
      if (avatar) {
        this.user.avatar = avatar;
      }
    },
    setAnonData(userObject) {
      this.user.gender = userObject.gender;
      this.user.birthdate = userObject.birthdate;
    },
    closeModalAndRedirect(router, path) {
      const modalStore = useModalStore();
      modalStore.closeModal();
      router.push({ name: path });
    },
    displayMessageModal(message, isErrorMessage = false) {
      const modalStore = useModalStore();
      modalStore.displayMessageModal(message, isErrorMessage);
    },
    resetUserStore() {
      this.$reset();
      this.token = null;
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
