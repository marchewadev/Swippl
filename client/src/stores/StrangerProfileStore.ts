import { defineStore } from "pinia";
import { useUserStore } from "./UserStore";
import { useModalStore } from "./ModalStore";
import { Router } from "vue-router";
import axios from "axios";
import socket from "../sockets/socket";
import { handleAxiosError } from "../utils/handleAxiosError";

interface StrangerState {
  stranger: StrangerData;
  showProfile: boolean;
  friendRequest: boolean;
  friendStatus: string | null;
}

interface StrangerData {
  name: string;
  age: number;
  gender: string;
  city: string;
  avatar: string;
}

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
    removeFriend(friendID: number, sessionID: string, router: Router) {
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
      const userStore = useUserStore();

      socket.on("friendStatus", async (friendStatus) => {
        try {
          if (friendStatus === "accepted") {
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
