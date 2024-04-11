<template>
  <app-layout>
    <template #boxTitle>
      <stranger-title></stranger-title>
    </template>
    <template #boxContent>
      <chat-content
        :send-message="sendMessageFn"
        :load-old-messages="{
          loadMoreMessagesFn,
          options: {
            direction: 'top',
            interval: 1000,
            distance: 150,
            canLoadMore: () => hasMoreMessages,
          },
        }"
      ></chat-content>
    </template>
  </app-layout>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/UserStore";
import { useChatStore } from "@/stores/ChatStore";
import AppLayout from "@/components/layouts/AppLayout.vue";
import StrangerTitle from "@/components/chat/StrangerTitle.vue";
import ChatContent from "@/components/chat/ChatContent.vue";

const route = useRoute();
const router = useRouter();
const chatStore = useChatStore();
const userStore = useUserStore();

const {
  getChatHistory,
  generatePrivateMessage,
  onJoinRoomError,
  sendPrivateMessage,
  onRoomError,
  loadMoreMessages,
  leavePrivateRoom,
} = chatStore;
const { areMessagesLoaded, hasMoreMessages } = storeToRefs(chatStore);
const { user } = storeToRefs(userStore);

const sendMessageFn = (message: string) => {
  if (message.trim() !== "") {
    sendPrivateMessage({
      message,
    });
  }
};

const loadMoreMessagesFn = () => {
  if (!areMessagesLoaded.value) return;

  if (user.value.id === null) return;
  loadMoreMessages({
    userID: user.value.id,
    friendID: Number(route.params.friendID),
    sessionID: Number(route.params.sessionID),
    page: chatStore.page + 1,
  });
};

onMounted(() => {
  onJoinRoomError(router);
  onRoomError();

  watch(
    () => [route.params.friendID, route.params.sessionID],
    ([friendID, sessionID]) => {
      if (user.value.id === null) return;

      chatStore.page = 1;
      getChatHistory({
        userID: user.value.id,
        friendID: Number(friendID),
        sessionID: Number(sessionID),
      });
    }
  );

  generatePrivateMessage();
});

onUnmounted(() => {
  leavePrivateRoom();
});
</script>
