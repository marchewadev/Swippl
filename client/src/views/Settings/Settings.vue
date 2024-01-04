<template>
  <app-layout>
    <template #boxTitle>
      <div class="flex items-center h-full group is-settings">
        <settings-navbar></settings-navbar>
      </div>
    </template>
    <template #boxContent>
      <div class="flex flex-col h-full justify-center items-center">
        <router-view></router-view>
      </div>
    </template>
  </app-layout>
</template>

<script setup>
import AppLayout from "@/components/layouts/AppLayout.vue";
import SettingsNavbar from "@/components/navbar/SettingsNavbar.vue";
</script>
