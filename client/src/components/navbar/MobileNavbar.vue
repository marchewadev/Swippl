<template>
  <button
    class="mobile-nav--btn text-3xl hidden max-[850px]:flex"
    @click="toggleMobileNav"
  >
    <ion-icon name="menu-outline"></ion-icon>
  </button>
  <transition name="fade">
    <div
      class="h-screen w-full overflow-auto fixed top-0 left-0 z-50"
      v-if="isMobileNavOpen"
    >
      <div class="mobile-nav h-full relative">
        <div
          class="bg-white h-full w-3/4 shadow-[rgba(0,0,0,0.1)_4px_0px_6px_-1px] z-40"
          v-on-click-outside="closeMobileNav"
        >
          <div class="logo p-3 shadow-md shadow-gray-200">
            <router-link :to="{ name: 'Home' }" class="w-fit block">
              <img
                src="../../assets/images/swippl-logo-light.png"
                alt="Swippl logo"
                class="h-6 min-[400px]:h-7 min-[1200px]:h-9"
              />
            </router-link>
          </div>
          <button
            class="w-full border-b border-gray-300 px-4 py-2 flex items-center justify-between transition-colors duration-150 active:bg-primary active:text-gray-50"
            v-if="checkIfUserIsLoggedIn"
            @click="toggleFriendList"
          >
            <span class="text-lg">Twoje czaty</span>
            <ion-icon
              name="chevron-down-outline"
              class="text-xl"
              v-show="!isFriendListOpen"
            ></ion-icon>
            <ion-icon
              name="chevron-up-outline"
              class="text-xl"
              v-show="isFriendListOpen"
            ></ion-icon>
          </button>
          <div class="friends h-full bg-inherit" v-show="isFriendListOpen">
            <sidebar-friend
              v-if="checkIfUserIsLoggedIn"
              v-for="(friend, index) in friends"
              :key="index"
              :friend_name="friend.name"
              :friend_id="friend.id"
              :friend_avatar="friend.avatar"
              :session_id="friend.sessionID"
              @click="setActiveFriend(friend.id)"
            ></sidebar-friend>
          </div>
          <div class="options flex flex-col" v-show="!isFriendListOpen">
            <mobile-nav-button :path="{ name: 'Terms', hash: '#contact' }">
              Kontakt
            </mobile-nav-button>
            <mobile-nav-button
              :path="{}"
              v-if="!checkIfUserIsLoggedIn"
              @click="openLoginModal"
            >
              Zaloguj się
            </mobile-nav-button>
            <mobile-nav-button
              :path="{}"
              v-if="!checkIfUserIsLoggedIn"
              @click="openRegisterModal"
            >
              Zarejestruj się
            </mobile-nav-button>
            <mobile-nav-button
              :path="{ name: 'Profile' }"
              v-if="checkIfUserIsLoggedIn"
            >
              Profil
            </mobile-nav-button>
            <mobile-nav-button
              :path="{ name: 'ChatSettings' }"
              v-if="checkIfUserIsLoggedIn"
            >
              Ustawienia
            </mobile-nav-button>
            <mobile-nav-button
              :path="{ name: 'Home' }"
              v-if="checkIfUserIsLoggedIn"
              @click="resetUserStore"
            >
              Wyloguj się
            </mobile-nav-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from "vue";
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
import { vOnClickOutside } from "@vueuse/components";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/UserStore";
import { useChatStore } from "@/stores/ChatStore";
import { useModalStore } from "@/stores/ModalStore";
import SidebarFriend from "../chat/SidebarFriend.vue";
import MobileNavButton from "../buttons/MobileNavButton.vue";

const userStore = useUserStore();
const chatStore = useChatStore();
const modalStore = useModalStore();

const { checkIfUserIsLoggedIn, resetUserStore } = userStore;
const { openModal } = modalStore;
const { friends } = storeToRefs(userStore);
const { showModal, selectedModal } = storeToRefs(modalStore);

const isFriendListOpen = ref(false);
const isMobileNavOpen = ref(false);

const setActiveFriend = (id) => {
  chatStore.activeFriendID = id;
};

const toggleFriendList = () => {
  isFriendListOpen.value = !isFriendListOpen.value;
};

const closeMobileNav = () => {
  isMobileNavOpen.value = false;
  showModal.value = false;
  selectedModal.value = "";
};

const toggleMobileNav = () => {
  isMobileNavOpen.value = !isMobileNavOpen.value;
  showModal.value = true;
  selectedModal.value = "mobile-nav";
};

const openLoginModal = () => {
  closeMobileNav();
  openModal("login");
};

const openRegisterModal = () => {
  closeMobileNav();
  openModal("register");
};

onBeforeRouteUpdate(() => {
  closeMobileNav();
  isFriendListOpen.value = false;
});

onBeforeRouteLeave(() => {
  closeMobileNav();
  isFriendListOpen.value = false;
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
