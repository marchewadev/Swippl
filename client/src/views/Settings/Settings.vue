<template>
  <app-layout>
    <template #boxTitle>
      <div class="flex items-center h-full group is-settings">
        <settings-navbar></settings-navbar>
      </div>
    </template>
    <template #boxContent>
      <router-view></router-view>
    </template>
  </app-layout>
</template>

<script setup>
import AppLayout from "@/components/layouts/AppLayout.vue";
import SettingsNavbar from "@/components/navbar/SettingsNavbar.vue";
</script>
