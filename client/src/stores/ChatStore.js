import dayjs from "dayjs";
import { useUserStore } from "./UserStore";
import { useStrangerProfileStore } from "./StrangerProfileStore";
import { useModalStore } from "./ModalStore";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import socket from "@/sockets/socket";
import axios from "axios";

export const useChatStore = defineStore("chatStore", {
  state: () => ({
    sessionID: null,
    isSearching: true,
    roomID: null,
    roomUsers: 0,
    messages: [],
    totalUsers: 0,
  }),
  actions: {
    connectToSocket() {
      socket.connect();

      socket.on("sessionInfo", (sessionID) => {
        this.sessionID = sessionID;
      });

      socket.on("connectedClients", (totalUsers) => {
        this.totalUsers = totalUsers;
      });
    },
    async joinRoom() {
      console.log(this.sessionID);
      const userStore = useUserStore();

      let userObject = {};

      if (userStore.token) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_SERVER}/user/verify`,
            { headers: { Authorization: `Bearer ${userStore.token}` } }
          );

          Object.assign(userObject, {
            userID: response.data.userObject.id,
            token: userStore.token,
            // id: this.sessionID,
            name: response.data.userObject.name,
            age: dayjs().diff(
              dayjs(response.data.userObject.birthdate),
              "year"
            ),
            gender: response.data.userObject.gender,
            city: response.data.userObject.city,
            searchCriteria: {
              age: userStore.searchCriteria.ageRangeSearch,
              gender: userStore.searchCriteria.genderSearch,
            },
          });
        } catch (err) {
          console.error(err);
          userStore.resetUserStore();
          // next("/");
        }
      } else {
        try {
          Object.assign(userObject, {
            // id: this.sessionID,
            // name: "Anonim",
            age: dayjs().diff(dayjs(userStore.user.birthdate), "year"),
            gender: userStore.user.gender,
            searchCriteria: {
              age: userStore.searchCriteria.ageRangeSearch,
              gender: userStore.searchCriteria.genderSearch,
            },
          });
        } catch (err) {
          console.log("chatStore error");
          return;
        }
      }

      const modalStore = useModalStore();
      const router = useRouter();

      try {
        console.log(userObject.id);
        socket.emit("joinRoom", userObject);

        // Add listeners related to the new room
        this.updateRoomData();
        this.generateMessage();
        this.userDisconnected();
        this.onJoinRoomError();
        this.onRoomError();
      } catch (err) {
        console.error(err);
      }
    },
    leaveRoom() {
      const strangerProfileStore = useStrangerProfileStore();

      socket.emit("leaveRoom", () => {
        this.roomUsers = 0;
        this.isSearching = true;
        this.messages = [];

        strangerProfileStore.resetStrangerData();
      });

      socket.off("roomData");
      socket.off("strangerData");
      socket.off("generateMessage");
      socket.off("userDisconnected");
      socket.off("joinRoomError");
      socket.off("roomError");
    },
    changeRoom() {
      this.leaveRoom();
      this.joinRoom();
    },
    updateRoomData() {
      const strangerProfileStore = useStrangerProfileStore();

      socket.on("roomData", (roomData) => {
        this.roomUsers = roomData.userCount;
      });

      socket.on("strangerData", (strangerObject) => {
        strangerProfileStore.setStrangerData(strangerObject);
      });
    },
    sendMessage(message) {
      socket.emit("sendMessage", {
        message,
        // sessionID: this.sessionID,
      });
    },
    generateMessage() {
      socket.on("generateMessage", (messageObject) => {
        const message = {
          content: messageObject.content,
          type: messageObject.senderID === this.sessionID ? "user" : "stranger",
        };

        this.messages.push(message);
      });
    },
    userDisconnected() {
      socket.on("userDisconnected", (messageObject) => {
        this.messages.push(messageObject);
      });
    },
    onJoinRoomError() {
      const modalStore = useModalStore();
      const router = useRouter();

      socket.on("joinRoomError", (error) => {
        modalStore.displayMessageModal(error, true);
        router.push({ name: "Settings" });
      });
    },
    onRoomError() {
      const modalStore = useModalStore();

      socket.on("roomError", (error) => {
        modalStore.displayMessageModal(error, true);
      });
    },
  },
});
