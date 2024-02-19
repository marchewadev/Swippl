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
      <h3 class="stranger--name">{{ strangerProfileStore.stranger.name }},</h3>
      <p>
        {{
          strangerProfileStore.stranger.gender === "female"
            ? "kobieta"
            : "mężczyzna"
        }}
      </p>
      <p class="stranger--age inline-block">
        {{ strangerProfileStore.stranger.age }} lat
      </p>
      <p
        class="stranger--city inline-block"
        v-if="strangerProfileStore.stranger.city"
      >
        , {{ strangerProfileStore.stranger.city }}
      </p>
    </div>
    <div class="stranger--options flex gap-2">
      <button
        class="text-gray-50 bg-primary p-2 rounded-md transition-colors duration-300 flex flex-col items-center"
        @click="handleFriendRequest"
        :class="{
          'hover:bg-primaryLight':
            strangerProfileStore.friendStatus !== 'pending',
          'opacity-50 cursor-not-allowed':
            strangerProfileStore.friendStatus === 'pending',
        }"
        :disabled="strangerProfileStore.friendStatus === 'pending'"
        v-if="strangerProfileStore.friendStatus !== 'accepted'"
      >
        <ion-icon name="person-add-outline" class="text-xl"></ion-icon>
        <span class="text-xs">Dodaj do znajomych</span>
      </button>
      <button
        class="text-primary bg-gray-200 p-2 rounded-md transition-colors duration-300 hover:bg-red-700 hover:text-gray-50 flex flex-col items-center"
        @click="removeFriend"
        v-else
      >
        <ion-icon name="person-remove-outline" class="text-xl"></ion-icon>
        <span class="text-xs">Usuń ze znajomych</span>
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
import socket from "@/sockets/socket";
import { useStrangerProfileStore } from "@/stores/StrangerProfileStore";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const strangerProfileStore = useStrangerProfileStore();

const handleFriendRequest = () => {
  if (!strangerProfileStore.friendRequest) {
    socket.emit("sendFriendRequest");
  } else {
    socket.emit("acceptFriendRequest");
  }
};

const removeFriend = () => {
  const friendID = Number(route.params.friendID);
  const sessionID = Number(route.params.sessionID);

  strangerProfileStore.removeFriend(friendID, sessionID, router);
};
</script>

<style scoped>
.stranger--close-profile-btn:hover .arrow-back {
  transform: scale(1.1);
}
</style>
