<template>
  <app-layout>
    <template #boxTitle>
      <stranger-title></stranger-title>
    </template>
    <template #boxContent>
      <chat-content
        :send-message="sendMessageFn"
        :load-more-messages="[
          loadMoreMessagesFn,
          {
            direction: 'top',
            interval: 1000,
            distance: 150,
            canLoadMore: () => hasMoreMessages,
          },
        ]"
      ></chat-content>
    </template>
  </app-layout>
</template>

<script setup>
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
} = chatStore;

const { areMessagesLoaded, hasMoreMessages } = storeToRefs(chatStore);
const { user } = storeToRefs(userStore);

const sendMessageFn = (message) => {
  if (message.trim() !== "") {
    sendPrivateMessage({
      message,
    });
  }
};

const loadMoreMessagesFn = () => {
  if (!areMessagesLoaded.value) return;

  loadMoreMessages({
    userID: user.value.id,
    friendID: route.params.friendID,
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
      chatStore.page = 1;
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
  // resetStrangerData();
  // privateSessionID.value = null;
  // activeFriendID.value = null;
  // messages.value = [];
  // chatStore.page = 1;
  // hasMoreMessages.value = false;
  // areMessagesLoaded.value = false;
  // socket.off("generatePrivateMessage");
});
</script>
