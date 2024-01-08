<template>
  <div class="h-full flex flex-col justify-center items-center gap-5 relative">
    <button
      class="stranger--close-profile-btn text-lg mt-3 ml-3 absolute top-0 left-0 flex items-center gap-2"
      @click="strangerProfileStore.closeProfile"
    >
      <ion-icon
        name="arrow-back-outline"
        class="arrow-back transition-transform duration-200"
      ></ion-icon>
      <span>Cofnij</span>
    </button>
    <div class="stranger--avatar-wrapper">
      <img
        :src="strangerProfileStore.getAvatar"
        alt="Stranger avatar"
        class="stranger--avatar h-64 rounded-full"
      />
    </div>
    <div class="stranger--personal-info text-center">
      <h3 class="stranger--name">Andrzej</h3>
      <p class="stranger--age inline-block mr-1">18 lat,</p>
      <p class="stranger--city inline-block">Wrocław</p>
    </div>
    <div class="stranger--options flex gap-2">
      <button
        class="text-gray-50 bg-primary p-2 rounded-md transition-colors duration-300 hover:bg-primaryLight flex flex-col items-center"
      >
        <ion-icon name="person-add-outline" class="text-xl"></ion-icon>
        <span class="text-xs">Dodaj do znajomych</span>
      </button>
      <button
        class="text-primary bg-gray-200 p-2 rounded-md transition-colors duration-300 hover:bg-red-700 hover:text-gray-50 flex flex-col items-center"
      >
        <ion-icon name="ban-outline" class="text-xl"></ion-icon>
        <span class="text-xs">Zablokuj</span>
      </button>
      <button
        class="text-primary bg-gray-200 p-2 rounded-md transition-colors duration-300 hover:bg-red-700 hover:text-gray-50 flex flex-col items-center"
      >
        <ion-icon name="flag-outline" class="text-xl"></ion-icon>
        <span class="text-xs">Zgłoś</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useStrangerProfileStore } from "@/stores/StrangerProfileStore";

const strangerProfileStore = useStrangerProfileStore();
</script>

<style scoped>
.stranger--close-profile-btn:hover .arrow-back {
  transform: scale(1.1);
}
</style>
