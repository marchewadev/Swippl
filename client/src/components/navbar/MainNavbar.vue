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

    <base-navbar class="flex items-center text-lg gap-5">
      <template #additional>
        <div>
          <p>1234 aktywnych osób</p>
        </div>
      </template>
      <template #links>
        <navbar-link :path="''">
          <template #title>O nas</template>
        </navbar-link>
        <navbar-link :path="''">
          <template #title>Kontakt</template>
        </navbar-link>
        <navbar-link @click="modalStore.openModal('login')" :path="''">
          <template #title>Zaloguj się</template>
        </navbar-link>
        <navbar-link @click="modalStore.openModal('register')" :path="''">
          <template #title>Zarejestruj się</template>
        </navbar-link>
      </template>
    </base-navbar>
  </header>
</template>

<script setup>
import BaseNavbar from "./BaseNavbar.vue";
import NavbarLink from "./NavbarLink.vue";
import { useModalStore } from "@/stores/ModalStore";

const modalStore = useModalStore();
</script>
