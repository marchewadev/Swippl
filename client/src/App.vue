<template>
  <router-view></router-view>
  <overlay></overlay>
  <message-modal></message-modal>
  <login-modal></login-modal>
  <register-modal></register-modal>
</template>

<script setup>
import Overlay from "./components/modals/Overlay.vue";
import LoginModal from "./components/modals/LoginModal.vue";
import RegisterModal from "./components/modals/RegisterModal.vue";

import MessageModal from "./components/modals/MessageModal.vue";
</script>
