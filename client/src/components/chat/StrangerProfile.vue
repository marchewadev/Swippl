<template>
  <div
    class="container h-full relative z-50 flex flex-col justify-center items-center gap-5"
  >
    <button
      class="stranger--close-profile-btn mt-3 ml-3 absolute top-0 left-0 flex items-center gap-2"
      @click="closeProfile"
    >
      <ion-icon
        name="arrow-back-outline"
        class="arrow-back text-base transition-transform duration-200 min-[1200px]:text-lg"
      ></ion-icon>
      <span class="text-sm min-[1200px]:text-base min-[1600px]:text-lg"
        >Cofnij</span
      >
    </button>
    <div class="stranger--avatar-wrapper">
      <img
        :src="getAvatar"
        alt="Stranger avatar"
        class="stranger--avatar w-1/2 mx-auto rounded-full"
      />
    </div>
    <div
      class="stranger--personal-info text-sm text-center min-[1600px]:text-base"
    >
      <h3 class="stranger--name">{{ stranger.name }},</h3>
      <p>
        {{ stranger.gender === "female" ? "kobieta" : "mężczyzna" }}
      </p>
      <p class="stranger--age inline-block">{{ stranger.age }} lat</p>
      <p class="stranger--city inline-block" v-if="stranger.city">
        , {{ stranger.city }}
      </p>
    </div>
    <div class="stranger--options flex flex-col gap-2">
      <button
        class="text-gray-50 bg-primary rounded-md p-1 transition-colors duration-300 flex flex-col items-center min-[1600px]:p-2"
        :class="{
          'hover:bg-primaryLight': friendStatus !== 'pending',
          'opacity-50 cursor-not-allowed': friendStatus === 'pending',
        }"
        :disabled="friendStatus === 'pending'"
        v-if="friendStatus !== 'accepted'"
        @click="handleFriendRequest"
      >
        <ion-icon
          name="person-add-outline"
          class="text-base min-[1200px]:text-lg min-[1600px]:text-xl"
        ></ion-icon>
        <span class="text-xs">Dodaj do znajomych</span>
      </button>
      <button
        class="text-primary bg-gray-200 rounded-md p-1 transition-colors duration-300 hover:text-gray-50 hover:bg-red-700 flex flex-col items-center min-[1600px]:p-2"
        v-else
        @click="removeFriend"
      >
        <ion-icon
          name="person-remove-outline"
          class="text-base min-[1200px]:text-lg min-[1600px]:text-xl"
        ></ion-icon>
        <span class="text-xs">Usuń ze znajomych</span>
      </button>
      <button
        class="text-primary bg-gray-200 rounded-md p-1 transition-colors duration-300 hover:text-gray-50 hover:bg-red-700 flex flex-col items-center min-[1600px]:p-2"
      >
        <ion-icon
          name="flag-outline"
          class="text-base min-[1200px]:text-lg min-[1600px]:text-xl"
        ></ion-icon>
        <span class="text-xs">Zgłoś</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useStrangerProfileStore } from "@/stores/StrangerProfileStore";
import socket from "@/sockets/socket";

const route = useRoute();
const router = useRouter();
const strangerProfileStore = useStrangerProfileStore();

const { closeProfile } = strangerProfileStore;
const { stranger, friendStatus, getAvatar } = storeToRefs(strangerProfileStore);

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

@media (min-width: 1200px) {
  .stranger--options {
    flex-direction: row;
  }
}

@media (max-width: 850px) {
  .container {
    border-radius: 0.375rem;
    background-color: white;
  }
}
</style>
