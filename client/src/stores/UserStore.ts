import { defineStore } from "pinia";
import { Router } from "vue-router";
import { useStorage } from "@vueuse/core";
import { useModalStore } from "@/stores/ModalStore";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { AnonData, UserData, UserState } from "@/interfaces/user";
import { UserAction } from "@/types/user";
import axios from "axios";

export const useUserStore = defineStore("userStore", {
  state: (): UserState => ({
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
    areCriteriaArbitrary: false,
  }),
  actions: {
    async handleUserAuthRequest(
      action: string,
      router: Router,
      userJSON: object
    ) {
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
        handleAxiosError(err);
      }
    },
    async handleUserUpdateRequest(
      url: string,
      router: Router,
      userJSON: object
    ) {
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
        handleAxiosError(err);
      }
    },
    async performUserAction(
      action: UserAction,
      router: Router,
      userJSON: object
    ) {
      switch (action) {
        case "register":
        case "login":
          await this.handleUserAuthRequest(action, router, userJSON);
          break;
        case "email":
        case "password":
          await this.handleUserUpdateRequest(action, router, userJSON);
          break;
        default:
          throw new Error(`Nieprawidłowa akcja: ${action}`);
      }
    },
    async updateUserProfile(userJSON: Record<string, string | boolean | File>) {
      try {
        const formData = new FormData();
        for (const key in userJSON) {
          if (Object.prototype.hasOwnProperty.call(userJSON, key)) {
            formData.append(key, String(userJSON[key]));
          }
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
        handleAxiosError(err);
      }
    },
    async deleteUserAvatar() {
      this.user.avatar = "";
    },
    async deleteUserAccount(router: Router, userJSON: object) {
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
        handleAxiosError(err);
      }
    },
    async resetUserPassword(userJSON: object) {
      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_BACKEND_SERVER}/user/update/reset-password`,
          userJSON
        );

        this.displayMessageModal(response.data.message);
      } catch (err) {
        handleAxiosError(err);
      }
    },
    setUserData({ id, name, birthdate, city, gender, avatar }: UserData) {
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
    setAnonData(userObject: AnonData) {
      this.user.gender = userObject.gender;
      this.user.birthdate = userObject.birthdate;
    },
    closeModalAndRedirect(router: Router, path: string) {
      const modalStore = useModalStore();
      modalStore.closeModal();
      router.push({ name: path });
    },
    displayMessageModal(message: string, isErrorMessage = false) {
      const modalStore = useModalStore();
      modalStore.displayMessageModal(message, isErrorMessage);
    },
    resetUserStore() {
      this.$reset();
      this.token = null;
    },
  },
  getters: {
    userAvatar(): string {
      return this.user.avatar;
    },
    checkIfUserIsLoggedIn(): boolean {
      return this.token !== null;
    },
  },
});
