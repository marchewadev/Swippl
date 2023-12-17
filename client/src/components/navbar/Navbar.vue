<template>
  <header
    class="flex items-center justify-between bg-white shadow-md shadow-gray-200 py-5 px-12"
  >
    <a href="#">
      <img
        src="../../assets/swippl-logo-light.png"
        alt="Swippl logo"
        class="h-9"
      />
    </a>

    <nav class="flex items-center text-lg gap-5">
      <div>
        <p><span>1234</span> aktywnych osób</p>
      </div>
      <ul class="flex items-center gap-1">
        <navbar-link :link-title="'O nas'"></navbar-link>
        <navbar-link :link-title="'Kontakt'"></navbar-link>
        <navbar-link
          :link-title="'Zaloguj się'"
          @click="modalStore.openModal('login')"
        ></navbar-link>
        <navbar-link
          :link-title="'Zarejestruj się'"
          @click="modalStore.openModal('register')"
        ></navbar-link>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import NavbarLink from "./NavbarLink.vue";
import { useModalStore } from "@/stores/ModalStore";
const modalStore = useModalStore();
</script>
