<template>
  <app-layout>
    <template #boxTitle>
      <div class="h-full flex items-center group is-settings">
        <settings-navbar></settings-navbar>
      </div>
    </template>
    <template #boxContent>
      <div class="h-full grid items-center justify-center">
        <router-view></router-view>
      </div>
    </template>
  </app-layout>
</template>

<script setup>
import AppLayout from "@/components/layouts/AppLayout.vue";
import SettingsNavbar from "@/components/navbar/SettingsNavbar.vue";
</script>
