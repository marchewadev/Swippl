import { useStrangerProfileStore } from "./StrangerProfileStore";
import { useUserStore } from "./UserStore";
import { useModalStore } from "./ModalStore";
import { useRouter } from "vue-router";
import { defineStore } from "pinia";
import socket from "@/sockets/socket";
import axios from "axios";
import dayjs from "dayjs";

export const useChatStore = defineStore("chatStore", {
  state: () => ({
    totalUsers: 0,
    roomUsers: 0,
    isSearching: true,
    sessionID: null,
    privateSessionID: null,
    activeFriendID: null,
    messages: [],
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
    async joinRoom(router) {
      const userStore = useUserStore();
      try {
        let userObject = {};

        if (userStore.token) {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_SERVER}/user/verify`,
            {
              headers: {
                Authorization: `Bearer ${userStore.token}`,
              },
            }
          );

          Object.assign(userObject, {
            token: userStore.token,
            userID: response.data.userObject.id,
            name: response.data.userObject.name,
            gender: response.data.userObject.gender,
            city: response.data.userObject.city,
            age: dayjs().diff(
              dayjs(response.data.userObject.birthdate),
              "year"
            ),
            avatar: response.data.userObject.avatar,
            friends: userStore.friends.map((friend) => friend.id),
          });
        } else {
          Object.assign(userObject, {
            gender: userStore.user.gender,
            age: dayjs().diff(dayjs(userStore.user.birthdate), "year"),
          });
        }

        if (userStore.areCriteriaArbitrary) {
          Object.assign(userObject, {
            searchCriteria: {
              age: [18, 100],
              gender: "any",
            },
          });
        } else {
          Object.assign(userObject, {
            searchCriteria: {
              age: userStore.searchCriteria.ageRangeSearch,
              gender: userStore.searchCriteria.genderSearch,
            },
          });
        }

        socket.emit("joinRoom", userObject);

        // Add listeners related to the new room
        this.updateRoomData();
        this.generateMessage();
        this.onJoinRoomError(router);
        this.onRoomError();
      } catch (err) {
        const router = useRouter();
        const modalStore = useModalStore();

        userStore.resetUserStore();
        modalStore.displayMessageModal(err.message, true);
        router.push({ name: "Settings" });
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
      });
    },
    generateMessage() {
      socket.on("generateMessage", (messageObject) => {
        let messageType;

        if (messageObject.type === "admin") {
          messageType = "admin";
        } else if (messageObject.senderID === this.sessionID) {
          messageType = "user";
        } else {
          messageType = "stranger";
        }

        const message = {
          content: messageObject.content,
          type: messageType,
        };

        this.$patch({ messages: [...this.messages, message] });
      });
    },
    onJoinRoomError(router) {
      const modalStore = useModalStore();

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
    createUserSession() {
      const userStore = useUserStore();

      socket.emit("createUserSession", {
        userID: userStore.user.id,
        friends: userStore.friends,
      });
    },
    getChatHistory(chatObject) {
      this.privateSessionID = chatObject.sessionID;

      socket.emit("getChatHistory", chatObject, (chatHistory) => {
        const strangerProfileStore = useStrangerProfileStore();
        this.messages = chatHistory.chatHistory;
        strangerProfileStore.friendStatus = chatHistory.friendStatus;
        strangerProfileStore.setStrangerData(chatHistory.friendObject);
      });
    },
    onFriendRemoved(router) {
      const modalStore = useModalStore();
      const userStore = useUserStore();

      socket.on("friendRemoved", async ({ sessionID, userName }, callback) => {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_SERVER}/user/verify`,
          { headers: { Authorization: `Bearer ${userStore.token}` } }
        );
        userStore.friends = response.data.friendsObject;

        if (this.privateSessionID === sessionID) {
          router.push({ name: "Settings" });
        }

        modalStore.displayMessageModal(
          `Użytkownik ${userName} usunął cię z listy znajomych`
        );
        callback();
      });
    },
    sendPrivateMessage({ message }) {
      const userStore = useUserStore();

      socket.emit("sendPrivateMessage", {
        message,
        userID: userStore.user.id,
        sessionID: this.privateSessionID,
      });
    },
    generatePrivateMessage() {
      socket.on("generatePrivateMessage", (messageObject) => {
        const userStore = useUserStore();

        let messageType;

        if (messageObject.type === "admin") {
          messageType = "admin";
        } else if (messageObject.senderID === userStore.user.id) {
          messageType = "user";
        } else {
          messageType = "stranger";
        }

        const message = {
          content: messageObject.content,
          type: messageType,
        };

        this.$patch({ messages: [...this.messages, message] });
      });
    },
  },
});
