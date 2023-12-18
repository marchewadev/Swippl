<template>
  <router-view></router-view>
  <overlay></overlay>
  <login-modal></login-modal>
  <register-modal></register-modal>
</template>

<script setup>
import Overlay from "./components/modals/Overlay.vue";
import LoginModal from "./components/modals/LoginModal.vue";
import RegisterModal from "./components/modals/RegisterModal.vue";
</script>
