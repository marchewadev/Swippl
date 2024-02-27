import { defineStore } from "pinia";
import { useUserStore } from "./UserStore";
import { useModalStore } from "./ModalStore";
import axios from "axios";
import socket from "@/sockets/socket";

export const useStrangerProfileStore = defineStore("strangerProfileStore", {
  state: () => ({
    stranger: {
      name: "",
      gender: "",
      age: "",
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
    setStrangerData({ name, age, gender, city }) {
      this.stranger.name = name;
      this.stranger.age = age;
      this.stranger.gender = gender;
      this.stranger.city = city;
    },
    resetStrangerData() {
      this.$reset();
    },
    sendFriendRequest() {
      socket.emit("sendFriendRequest");
    },
    acceptFriendRequest() {
      socket.emit("acceptFriendRequest");
    },
    removeFriend(friendID, sessionID, router) {
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
      const modalStore = useModalStore();

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
          modalStore.displayMessageModal(err.response.data.message, true);
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
    getAvatar() {
      return this.stranger.avatar || "/src/assets/avatar.png";
    },
  },
});
