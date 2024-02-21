<template>
  <main-navbar></main-navbar>
  <main class="box min-w-4/5 mx-auto rounded-md my-auto">
    <div
      class="sidebar--profile bg-secondary rounded-tl-md shadow-md flex items-center gap-2 min-[1200px]:p-5 p-3 max-[850px]:hidden"
    >
      <div>
        <ion-icon
          name="people-outline"
          class="min-[1600px]:text-4xl min-[1200px]:text-3xl text-2xl"
        ></ion-icon>
      </div>
      <h1 class="font-medium min-[1600px]:text-xl min-[1200px]:text-lg text-sm">
        Twoje czaty
      </h1>
    </div>

    <div class="sidebar--wrapper overflow-scroll h-full">
      <!-- <div
      class="sidebar--wrapper shadow-[rgba(0,0,0,0.1)_4px_0px_6px_-1px] overflow-scroll h-full max-[850px]:hidden"
    > -->
      <div
        class="sidebar--chats h-full relative max-[850px]:hidden"
        v-if="!strangerProfileStore.show"
      >
        <sidebar-friend
          v-if="userStore.checkIfUserIsLoggedIn"
          v-for="(friend, index) in userStore.friends"
          :key="index"
          :friend_name="friend.name"
          :friend_id="friend.id"
          :session_id="friend.sessionID"
          @click="setActiveFriend(friend.id)"
        ></sidebar-friend>
        <div
          class="get-access bg-secondary w-5/6 p-2 rounded-md opacity-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute"
          v-else="!userStore.checkIfUserIsLoggedIn"
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

    <div
      class="box--title p-4 shadow-md relative max-[850px]:h-16 max-[850px]:flex overflow-auto"
    >
      <slot name="boxTitle"></slot>
    </div>
    <div class="box--content overflow-auto">
      <slot name="boxContent"></slot>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStrangerProfileStore } from "@/stores/StrangerProfileStore";
import { useUserStore } from "@/stores/UserStore";
import { useChatStore } from "@/stores/ChatStore";
import MainNavbar from "../navbar/MainNavbar.vue";
import StrangerProfile from "../chat/StrangerProfile.vue";
import SidebarFriend from "../chat/SidebarFriend.vue";

const route = useRoute();
const router = useRouter();
const isChatRoute = computed(
  () => route.name === "Chat" || route.name === "PrivateChat"
);

const strangerProfileStore = useStrangerProfileStore();
const userStore = useUserStore();
const chatStore = useChatStore();

onMounted(() => {
  const friendID = route.params.friendID;
  if (friendID) {
    chatStore.activeFriendID = Number(friendID);
  }

  chatStore.onFriendRemoved(router);
});

const setActiveFriend = (id) => {
  chatStore.activeFriendID = id;
};
</script>

<style scoped>
.box {
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-template-rows: auto 1fr;
  box-shadow: 1px 3px 10px rgba(0, 0, 0, 0.2);
  width: 80vw;
  height: 85vh;
}
.sidebar--profile {
  grid-column: 1;
  grid-row: 1;
}

.sidebar--wrapper {
  grid-column: 1;
  grid-row: 2;
  box-shadow: 4px 0px 6px -1px rgba(0, 0, 0, 0.1);
  /* rgba(0,0,0,0.1)_4px_0px_6px_-1px */
}

.box--title {
  grid-column: 2;
  grid-row: 1;
}

.box--content {
  grid-column: 2;
  grid-row: 2;
}

@media (max-width: 850px) {
  .box--title {
    grid-column: 1 / -1;
  }

  .box--content {
    grid-column: 1 / -1;
  }

  .sidebar--wrapper {
    grid-column: 1 / -1;
    grid-row: 1 / -1;
    box-shadow: none;
  }

  /* .sidebar--wrapper {
    grid-column: 1 / -1;
  } */
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
