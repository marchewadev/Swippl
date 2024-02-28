<template>
  <div
    class="stranger max-w-fit flex items-center gap-2"
    v-if="shouldShowStrangerInfo"
  >
    <img
      :src="getAvatar"
      alt="Stranger's avatar"
      class="stranger--avatar h-10 rounded-full cursor-pointer aspect-square min-[1600px]:h-12"
      @click="openProfile"
    />
    <div>
      <h2
        class="stranger--name text-base mr-1 inline-block min-[1600px]:text-lg"
      >
        {{ stranger.name }},
      </h2>
      <p class="stranger--age text-base inline-block min-[1600px]:text-lg">
        {{ stranger.age }}
      </p>
    </div>
    <button class="flex" @click="openProfile">
      <ion-icon
        name="information-outline"
        class="text-sm border border-primary rounded-full transition-colors duration-300 hover:bg-primary hover:text-gray-50 min-[1600px]:text-base"
      ></ion-icon>
    </button>
  </div>

  <div
    class="settings absolute left-full bottom-full -translate-x-full translate-y-full"
    :class="{
      'py-2 flex items-center gap-1': isChatRouletteRoute,
      'p-2': !isChatRouletteRoute,
    }"
  >
    <router-link :to="{ name: 'Settings' }" class="settings--btn">
      <ion-icon
        name="settings-outline"
        class="settings--icon text-lg transition-transform duration-700 min-[1600px]:text-xl"
      ></ion-icon
    ></router-link>

    <button
      class="disconnect--btn transition-colors duration-300 hover:text-red-700"
      v-if="isChatRouletteRoute"
      @click="changeRoom"
    >
      <ion-icon
        name="close-outline"
        class="text-xl min-[1600px]:text-2xl"
      ></ion-icon>
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useChatStore } from "@/stores/ChatStore";
import { useStrangerProfileStore } from "@/stores/StrangerProfileStore";

const route = useRoute();

const chatStore = useChatStore();
const strangerProfileStore = useStrangerProfileStore();

// Chat store
const { isSearching } = storeToRefs(chatStore);
const { changeRoom } = chatStore;
// Stranger's profile store
const { stranger, getAvatar } = storeToRefs(strangerProfileStore);
const { openProfile } = strangerProfileStore;

const isChatRouletteRoute = computed(() => route.name === "Chat");

const shouldShowStrangerInfo = computed(() => {
  if (!isChatRouletteRoute.value) {
    return true;
  }

  if (isChatRouletteRoute.value && !isSearching.value) {
    return true;
  }

  return false;
});
</script>

<style scoped>
.settings--btn:hover .settings--icon {
  transform: rotate(360deg);
}
</style>
