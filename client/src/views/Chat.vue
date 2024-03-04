<template>
  <app-layout>
    <template #boxTitle>
      <stranger-title></stranger-title>
    </template>
    <template #boxContent>
      <loading-screen v-if="chatStore.isSearching"></loading-screen>
      <chat-content
        :send-message="sendMessageFn"
        v-if="!chatStore.isSearching"
      ></chat-content>
    </template>
  </app-layout>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useChatStore } from "@/stores/ChatStore";
import { useUserStore } from "@/stores/UserStore";
import { useStrangerProfileStore } from "@/stores/StrangerProfileStore";
import AppLayout from "@/components/layouts/AppLayout.vue";
import LoadingScreen from "@/components/chat/LoadingScreen.vue";
import StrangerTitle from "@/components/chat/StrangerTitle.vue";
import ChatContent from "@/components/chat/ChatContent.vue";

const router = useRouter();
const chatStore = useChatStore();
const userStore = useUserStore();
const strangerProfileStore = useStrangerProfileStore();

const { joinRoom, leaveRoom, sendMessage } = chatStore;
const { updateFriendRequest, updateFriendStatus } = strangerProfileStore;

const { areCriteriaArbitrary } = storeToRefs(userStore);
const { roomUsers, isSearching } = storeToRefs(chatStore);

const sendMessageFn = (message) => {
  if (message.trim() !== "") {
    sendMessage(message);
  }
};

onMounted(() => {
  watch(
    () => roomUsers.value,
    (newVal, oldVal) => {
      if (newVal === 2) {
        isSearching.value = false;
      }
    }
  );

  joinRoom(router);
  updateFriendRequest();
  updateFriendStatus();
});

onBeforeRouteLeave(() => {
  leaveRoom();

  if (areCriteriaArbitrary.value) {
    areCriteriaArbitrary.value = false;
  }
});
</script>
