<template>
  <header
    class="bg-white shadow-md shadow-gray-200 px-2.5 py-2.5 flex items-center justify-between min-[851px]:px-8 min-[851px]:py-4 min-[1600px]:px-12 min-[1600px]:py-5"
  >
    <router-link :to="{ name: 'Home' }">
      <img
        src="../../assets/images/swippl-logo-light.png"
        alt="Swippl logo"
        class="h-6 min-[400px]:h-7 min-[1200px]:h-9"
      />
    </router-link>

    <base-navbar
      class="text-xs flex items-center gap-2.5 min-[400px]:text-sm min-[851px]:gap-5 min-[1200px]:text-base min-[1600px]:text-lg"
    >
      <template #additional>
        <div>
          <p v-if="totalUsers === 1">{{ totalUsers }} aktywna osoba</p>
          <p v-else-if="totalUsers < 5">{{ totalUsers }} aktywne osoby</p>
          <p v-else>{{ totalUsers }} aktywnych osób</p>
        </div>
      </template>
      <template #links>
        <mobile-navbar></mobile-navbar>
        <desktop-navbar></desktop-navbar>
      </template>
    </base-navbar>
  </header>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useChatStore } from "@/stores/ChatStore";
import BaseNavbar from "./BaseNavbar.vue";
import MobileNavbar from "./MobileNavbar.vue";
import DesktopNavbar from "./DesktopNavbar.vue";

const chatStore = useChatStore();
const { totalUsers } = storeToRefs(chatStore);
</script>
