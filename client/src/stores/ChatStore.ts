import { defineStore } from "pinia";
import { Router } from "vue-router";
import { useStrangerProfileStore } from "@/stores/StrangerProfileStore";
import { useUserStore } from "@/stores/UserStore";
import { useModalStore } from "@/stores/ModalStore";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { ChatHistoryObject, ChatObject, ChatState } from "@/interfaces/chat";
import { MessageType } from "@/types/chat";
import socket from "@/sockets/socket";
import axios from "axios";
import dayjs from "dayjs";

export const useChatStore = defineStore("chatStore", {
  state: (): ChatState => ({
    totalUsers: 0,
    roomUsers: 0,
    isSearching: true,
    sessionID: null,
    privateSessionID: null,
    activeFriendID: null,
    page: 1,
    areMessagesLoaded: false,
    areMessagesLoading: false,
    hasMoreMessages: false,
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
    async joinRoom(router: Router) {
      try {
        const userStore = useUserStore();

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
        handleAxiosError(err);
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
    leavePrivateRoom() {
      const strangerProfileStore = useStrangerProfileStore();

      this.privateSessionID = null;
      this.activeFriendID = null;
      this.areMessagesLoaded = false;
      this.hasMoreMessages = false;
      this.messages = [];
      this.page = 1;

      strangerProfileStore.resetStrangerData();
      socket.off("generatePrivateMessage");
    },
    changeRoom(router: Router) {
      this.leaveRoom();
      this.joinRoom(router);
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
    sendMessage(message: string) {
      socket.emit("sendMessage", {
        message,
      });
    },
    generateMessage() {
      socket.on("generateMessage", (messageObject) => {
        let messageType: MessageType;

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
    onJoinRoomError(router: Router) {
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
    getChatHistory(chatObject: ChatObject) {
      this.areMessagesLoaded = false;
      this.privateSessionID = chatObject.sessionID;

      socket.emit(
        "getChatHistory",
        chatObject,
        (chatHistory: ChatHistoryObject) => {
          const strangerProfileStore = useStrangerProfileStore();

          this.messages = chatHistory.chatHistory;
          this.areMessagesLoaded = true;
          this.hasMoreMessages = chatHistory.hasMoreMessages;

          strangerProfileStore.friendStatus = chatHistory.friendStatus;
          strangerProfileStore.setStrangerData(chatHistory.friendObject);
        }
      );
    },
    loadMoreMessages(chatObject: ChatObject) {
      this.areMessagesLoading = true;

      socket.emit(
        "getChatHistory",
        chatObject,
        (chatHistory: ChatHistoryObject) => {
          this.messages.unshift(...chatHistory.chatHistory);
          this.hasMoreMessages = chatHistory.hasMoreMessages;
          this.page++;

          this.areMessagesLoading = false;
        }
      );
    },
    onFriendRemoved(router: Router) {
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
    sendPrivateMessage({ message }: { message: string }) {
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

        let messageType: MessageType;

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
