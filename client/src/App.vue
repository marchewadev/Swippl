<template>
  <router-view></router-view>
  <overlay></overlay>
  <message-modal></message-modal>
  <anon-modal></anon-modal>
  <login-modal></login-modal>
  <register-modal></register-modal>
</template>

<script setup lang="ts">
import Overlay from "./components/modals/Overlay.vue";
import LoginModal from "./components/modals/LoginModal.vue";
import RegisterModal from "./components/modals/RegisterModal.vue";
import AnonModal from "./components/modals/AnonModal.vue";
import MessageModal from "./components/modals/MessageModal.vue";

// Connect to socket on app load to get session id
import { useChatStore } from "./stores/ChatStore";
const chatStore = useChatStore();
chatStore.connectToSocket();
</script>
