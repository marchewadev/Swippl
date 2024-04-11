import { defineStore } from "pinia";
import { Router } from "vue-router";
import { useUserStore } from "@/stores/UserStore";
import { useModalStore } from "@/stores/ModalStore";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { StrangerState, StrangerData } from "@/interfaces/user";
import socket from "@/sockets/socket";
import axios from "axios";

export const useStrangerProfileStore = defineStore("strangerProfileStore", {
  state: (): StrangerState => ({
    stranger: {
      name: "",
      gender: "",
      age: 18,
      city: "",
      avatar: "",
    },
    showProfile: false,
    friendRequest: false,
    friendStatus: null,
  }),
  actions: {
    openProfile() {
      this.showProfile = true;
    },
    closeProfile() {
      this.showProfile = false;
    },
    resetStrangerData() {
      this.$reset();
    },
    setStrangerData({ name, age, gender, city, avatar }: StrangerData) {
      this.stranger.name = name;
      this.stranger.age = age;
      this.stranger.gender = gender;
      this.stranger.city = city;
      this.stranger.avatar = avatar;
    },
    reportStranger() {
      const modalStore = useModalStore();

      socket.emit("reportStranger", () => {
        modalStore.displayMessageModal(
          "Użytkownik został zgłoszony. Dziękujemy za pomoc!",
          false
        );
        this.closeProfile();
      });
    },
    sendFriendRequest() {
      socket.emit("sendFriendRequest");
    },
    acceptFriendRequest() {
      socket.emit("acceptFriendRequest");
    },
    removeFriend(friendID: number, sessionID: number, router: Router) {
      const userStore = useUserStore();
      const userID = userStore.user.id;
      const userName = userStore.user.name;

      socket.emit(
        "removeFriend",
        { userID, userName, friendID, sessionID },
        () => {
          router.push({ name: "Settings" });
        }
      );
    },
    updateFriendStatus() {
      socket.on("friendStatus", async (friendStatus) => {
        try {
          if (friendStatus === "accepted") {
            const userStore = useUserStore();
            const response = await axios.get(
              `${import.meta.env.VITE_BACKEND_SERVER}/user/verify`,
              { headers: { Authorization: `Bearer ${userStore.token}` } }
            );

            userStore.friends = response.data.friendsObject;
          }

          this.friendStatus = friendStatus;
        } catch (err) {
          handleAxiosError(err);
        }
      });
    },
    updateFriendRequest() {
      socket.on("friendRequest", (friendRequest) => {
        this.friendRequest = friendRequest;
      });
    },
  },
  getters: {
    getAvatar(): string {
      return this.stranger.avatar;
    },
  },
});
