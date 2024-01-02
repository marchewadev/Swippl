<template>
  <base-navbar>
    <template #links>
      <navbar-link
        v-for="setting in settingsStore.buttons"
        :key="setting.id"
        :path="
          setting.requiresAuth && !settingsStore.isLoggedIn
            ? ''
            : `/settings/${setting.path}`
        "
        :class="{
          'group is-red': setting.isRed,
          'opacity-50 pointer-events-none':
            setting.requiresAuth && !settingsStore.isLoggedIn,
        }"
      >
        <template #icon>
          <ion-icon :name="setting.iconName" class="text-lg"></ion-icon>
        </template>
        <template #title>{{ setting.title }}</template>
      </navbar-link>
    </template>
  </base-navbar>
</template>

<script setup>
import { useSettingsStore } from "@/stores/SettingsStore";
import BaseNavbar from "./BaseNavbar.vue";
import NavbarLink from "./NavbarLink.vue";
const settingsStore = useSettingsStore();
</script>
