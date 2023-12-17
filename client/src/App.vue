<template>
  <navbar></navbar>
  <home></home>
  <footer-el></footer-el>
  <overlay></overlay>
  <login-modal></login-modal>
  <register-modal></register-modal>
</template>

<script setup>
import Navbar from "./components/navbar/Navbar.vue";
import Home from "./views/Home.vue";
import FooterEl from "./components/footer/FooterEl.vue";
import Overlay from "./components/modals/Overlay.vue";
import LoginModal from "./components/modals/LoginModal.vue";
import RegisterModal from "./components/modals/RegisterModal.vue";
</script>
