<template>
  <app-layout>
    <template #boxTitle>
      <stranger-title></stranger-title>
    </template>
    <template #boxContent>
      <chat-content :send-message="sendMessageFn"></chat-content>
    </template>
  </app-layout>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/UserStore";
import { useChatStore } from "@/stores/ChatStore";
import { useStrangerProfileStore } from "@/stores/StrangerProfileStore";
import socket from "@/sockets/socket";
import AppLayout from "@/components/layouts/AppLayout.vue";
import StrangerTitle from "@/components/chat/StrangerTitle.vue";
import ChatContent from "@/components/chat/ChatContent.vue";

const route = useRoute();

const chatStore = useChatStore();
const userStore = useUserStore();
const strangerProfileStore = useStrangerProfileStore();

const { resetStrangerData } = strangerProfileStore;
const {
  getChatHistory,
  generatePrivateMessage,
  onJoinRoomError,
  sendPrivateMessage,
} = chatStore;

const { privateSessionID, activeFriendID, messages } = storeToRefs(chatStore);
const { user } = storeToRefs(userStore);

const sendMessageFn = (message) => {
  if (message.trim() !== "") {
    sendPrivateMessage({
      message,
    });
  }
};

onMounted(() => {
  onJoinRoomError();

  watch(
    () => [route.params.friendID, route.params.sessionID],
    ([friendID, sessionID]) => {
      getChatHistory({
        userID: user.value.id,
        friendID,
        sessionID: Number(sessionID),
      });
    }
  );

  generatePrivateMessage();
});

onUnmounted(() => {
  resetStrangerData();
  privateSessionID.value = null;
  activeFriendID.value = null;
  messages.value = [];
  socket.off("generatePrivateMessage");
});
</script>
