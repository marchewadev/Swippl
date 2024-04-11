<template>
  <base-navbar>
    <template #links>
      <navbar-link
        class="text-xs whitespace-nowrap min-[1200px]:text-sm min-[1600px]:text-base"
        v-for="setting in buttons"
        :class="{
          'group is-red': setting.isRed,
          'opacity-50 pointer-events-none':
            setting.requiresAuth && !checkIfUserIsLoggedIn,
        }"
        :key="setting.id"
        :path="
          setting.requiresAuth && !checkIfUserIsLoggedIn
            ? {}
            : { path: `/settings/${setting.path}` }
        "
      >
        <template #icon>
          <ion-icon
            :name="setting.iconName"
            class="text-sm min-[1200px]:text-base min-[1600px]:text-lg"
          ></ion-icon>
        </template>
        <template #title>{{ setting.title }}</template>
      </navbar-link>
    </template>
  </base-navbar>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore";
import { useSettingsStore } from "@/stores/SettingsStore";
import BaseNavbar from "@/components/navbar/BaseNavbar.vue";
import NavbarLink from "@/components/navbar/NavbarLink.vue";

const userStore = useUserStore();
const settingsStore = useSettingsStore();

const { buttons } = settingsStore;
const { checkIfUserIsLoggedIn } = userStore;
</script>
