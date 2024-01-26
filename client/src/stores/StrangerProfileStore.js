import { defineStore } from "pinia";

export const useStrangerProfileStore = defineStore("strangerProfileStore", {
  state: () => ({
    stranger: {
      id: null,
      name: "",
      gender: "",
      age: "",
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
    setStrangerData({ name, age, gender, city }) {
      this.stranger.name = name;
      this.stranger.age = age;
      this.stranger.gender = gender;
      this.stranger.city = city;
    },
    resetStrangerData() {
      this.$reset();
    },
  },
  getters: {
    getAvatar() {
      return this.stranger.avatar || "/src/assets/avatar.png";
    },
  },
});
