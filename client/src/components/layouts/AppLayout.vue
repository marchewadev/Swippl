<template>
  <main-navbar></main-navbar>
  <main class="box flex-grow min-w-4/5 mx-auto my-14 rounded-md">
    <div
      class="sidebar--profile bg-secondary p-5 rounded-tl-md shadow-md flex items-center gap-2"
    >
      <div>
        <ion-icon name="people-outline" class="text-4xl"></ion-icon>
      </div>
      <h1 class="text-xl font-medium">Twoje czaty</h1>
    </div>

    <div class="sidebar--wrapper shadow-[rgba(0,0,0,0.1)_4px_0px_6px_-1px]">
      <div
        class="sidebar--chats h-full relative"
        v-if="!strangerProfileStore.show"
      >
        <div
          class="get-access bg-secondary w-5/6 p-2 rounded-md opacity-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute"
          v-if="!userStore.checkIfUserIsLoggedIn"
        >
          <p class="text-sm text-center text-primaryDark">
            Zaloguj się, aby mieć dostęp do tej zawartości
          </p>
        </div>
      </div>
      <stranger-profile
        class="sidebar--stranger-profile"
        v-else-if="isChatRoute && strangerProfileStore.show"
      ></stranger-profile>
    </div>

    <div class="box--title p-4 shadow-md relative">
      <slot name="boxTitle"></slot>
    </div>
    <div class="box--content">
      <slot name="boxContent"></slot>
    </div>
  </main>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStrangerProfileStore } from "@/stores/StrangerProfileStore";
import { useUserStore } from "@/stores/UserStore";
import MainNavbar from "../navbar/MainNavbar.vue";
import StrangerProfile from "../chat/StrangerProfile.vue";

const route = useRoute();
const isChatRoute = computed(() => route.name === "Chat");

const strangerProfileStore = useStrangerProfileStore();
const userStore = useUserStore();
</script>

<style scoped>
.box {
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-template-rows: auto 1fr;
  box-shadow: 1px 3px 10px rgba(0, 0, 0, 0.2);
  width: 80vw;
}
.sidebar--profile {
  grid-column: 1;
  grid-row: 1;
}

.sidebar--wrapper {
  grid-column: 1;
  grid-row: 2;
}

.box--title {
  grid-column: 2;
  grid-row: 1;
}

.box--content {
  grid-column: 2;
  grid-row: 2;
}

.sidebar--chats:hover .get-access {
  animation: slideDown 1s;
  opacity: 1;
}

@keyframes slideDown {
  0% {
    top: 0%;
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
