<template>
  <header
    class="flex items-center justify-between bg-white shadow-md shadow-gray-200 min-[1600px]:py-5 min-[1600px]:px-12 min-[851px]:py-4 min-[851px]:px-8 py-2.5 px-2.5"
  >
    <a href="#">
      <img
        src="../../assets/swippl-logo-light.png"
        alt="Swippl logo"
        class="min-[1200px]:h-9 min-[400px]:h-7 h-6"
      />
    </a>

    <base-navbar
      class="flex items-center min-[1200px]:text-base min-[1600px]:text-lg min-[400px]:text-sm min-[851px]:gap-5 text-xs gap-2.5"
    >
      <template #additional>
        <div>
          <p v-if="chatStore.totalUsers === 1">
            {{ chatStore.totalUsers }} aktywna osoba
          </p>
          <p v-else-if="chatStore.totalUsers < 5">
            {{ chatStore.totalUsers }} aktywne osoby
          </p>
          <p v-else>{{ chatStore.totalUsers }} aktywnych osób</p>
        </div>
      </template>
      <template #links>
        <button
          class="mobile-nav--btn max-[850px]:flex hidden text-3xl"
          @click="toggleMobileNav"
        >
          <ion-icon name="menu-outline"></ion-icon>
        </button>

        <transition name="fade">
          <div
            class="h-screen fixed top-0 left-0 w-full z-50 overflow-auto"
            v-if="isMobileNavOpen"
          >
            <div class="relative h-full mobile-nav">
              <div
                class="bg-white w-3/4 h-full z-40 shadow-[rgba(0,0,0,0.1)_4px_0px_6px_-1px]"
                v-on-click-outside="closeMobileNav"
              >
                <div class="logo py-3 px-3 shadow-md shadow-gray-200">
                  <a href="#" class="block w-fit">
                    <img
                      src="../../assets/swippl-logo-light.png"
                      alt="Swippl logo"
                      class="min-[1200px]:h-9 min-[400px]:h-7 h-6"
                    />
                  </a>
                </div>
                <button
                  class="flex justify-between items-center border-b border-gray-300 py-2 px-4 active:bg-primary active:text-gray-50 transition-colors duration-150 w-full"
                  @click="toggleFriendList"
                  v-if="userStore.checkIfUserIsLoggedIn"
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
                <div
                  class="friends h-full bg-inherit"
                  v-show="isFriendListOpen"
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
                </div>
                <div class="options flex flex-col" v-show="!isFriendListOpen">
                  <router-link
                    :to="''"
                    class="text-lg border-b border-gray-300 py-2 px-4 active:bg-primary active:text-gray-50 transition-colors duration-150"
                    >O nas</router-link
                  >
                  <router-link
                    :to="''"
                    class="text-lg border-b border-gray-300 py-2 px-4 active:bg-primary active:text-gray-50 transition-colors duration-150"
                    >Kontakt</router-link
                  >
                  <router-link
                    :to="''"
                    class="text-lg border-b border-gray-300 py-2 px-4 active:bg-primary active:text-gray-50 transition-colors duration-150"
                    @click="openLoginModal"
                    v-if="!userStore.checkIfUserIsLoggedIn"
                    >Zaloguj się</router-link
                  >
                  <router-link
                    :to="''"
                    class="text-lg border-b border-gray-300 py-2 px-4 active:bg-primary active:text-gray-50 transition-colors duration-150"
                    @click="openRegisterModal"
                    v-if="!userStore.checkIfUserIsLoggedIn"
                    >Zarejestruj się</router-link
                  >
                  <router-link
                    :to="{ name: 'Profile' }"
                    class="text-lg border-b border-gray-300 py-2 px-4 active:bg-primary active:text-gray-50 transition-colors duration-150"
                    v-if="userStore.checkIfUserIsLoggedIn"
                  >
                    Profil
                  </router-link>
                  <router-link
                    :to="{ name: 'ChatSettings' }"
                    class="text-lg border-b border-gray-300 py-2 px-4 active:bg-primary active:text-gray-50 transition-colors duration-150"
                    v-if="userStore.checkIfUserIsLoggedIn"
                  >
                    Ustawienia
                  </router-link>
                  <router-link
                    :to="{ name: 'Home' }"
                    class="text-lg border-b border-gray-300 py-2 px-4 active:bg-primary active:text-gray-50 transition-colors duration-150"
                    @click="userStore.resetUserStore"
                    v-if="userStore.checkIfUserIsLoggedIn"
                  >
                    Wyloguj się
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <div class="flex items-center gap-1 max-[850px]:hidden">
          <navbar-link :path="''">
            <template #title>O nas</template>
          </navbar-link>
          <navbar-link :path="''">
            <template #title>Kontakt</template>
          </navbar-link>
          <navbar-link
            @click="modalStore.openModal('login')"
            :path="''"
            v-if="!userStore.checkIfUserIsLoggedIn"
          >
            <template #title>Zaloguj się</template>
          </navbar-link>
          <navbar-link
            @click="modalStore.openModal('register')"
            :path="''"
            v-if="!userStore.checkIfUserIsLoggedIn"
          >
            <template #title>Zarejestruj się</template>
          </navbar-link>
          <li v-if="userStore.checkIfUserIsLoggedIn">
            <div class="relative">
              <img
                :src="userStore.userAvatar"
                alt="User's avatar"
                @click="dropdownOpen = !dropdownOpen"
                v-on-click-outside="closeDropdown"
                class="cursor-pointer h-10 rounded-full"
              />
              <div
                v-show="dropdownOpen"
                class="absolute bg-white mt-2 w-48 rounded-md right-0 dropdown-menu z-20"
              >
                <ul>
                  <navbar-link
                    :path="{ name: 'Profile' }"
                    :custom-class-link="'text-base block rounded-none rounded-tl-md rounded-tr-md flex items-center gap-2'"
                  >
                    <template #icon>
                      <ion-icon
                        name="person-outline"
                        class="text-lg"
                      ></ion-icon>
                    </template>
                    <template #title>Profil</template>
                  </navbar-link>
                  <navbar-link
                    :path="{ name: 'ChatSettings' }"
                    :custom-class-link="'text-base block rounded-none flex items-center gap-2'"
                  >
                    <template #icon>
                      <ion-icon
                        name="settings-outline"
                        class="text-lg"
                      ></ion-icon>
                    </template>
                    <template #title>Ustawienia</template>
                  </navbar-link>
                  <navbar-link
                    :path="{ name: 'Home' }"
                    :custom-class-link="'text-base block rounded-none rounded-bl-md rounded-br-md flex items-center gap-2'"
                    @click="userStore.resetUserStore"
                  >
                    <template #icon>
                      <ion-icon name="power-outline" class="text-lg"></ion-icon>
                    </template>
                    <template #title>Wyloguj się</template>
                  </navbar-link>
                </ul>
              </div>
            </div>
          </li>
        </div>
      </template>
    </base-navbar>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { vOnClickOutside } from "@vueuse/components";
import { useModalStore } from "@/stores/ModalStore";
import { useUserStore } from "@/stores/UserStore";
import { useChatStore } from "@/stores/ChatStore";
import BaseNavbar from "./BaseNavbar.vue";
import NavbarLink from "./NavbarLink.vue";
import SidebarFriend from "../chat/SidebarFriend.vue";
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";

const dropdownOpen = ref(false);
const isMobileNavOpen = ref(false);

const isFriendListOpen = ref(false);

const modalStore = useModalStore();
const userStore = useUserStore();
const chatStore = useChatStore();

const setActiveFriend = (id) => {
  chatStore.activeFriendID = id;
};

function toggleFriendList() {
  isFriendListOpen.value = !isFriendListOpen.value;
}

function closeDropdown() {
  dropdownOpen.value = false;
}

function toggleMobileNav() {
  isMobileNavOpen.value = !isMobileNavOpen.value;
  modalStore.show = true;
  modalStore.selectedModal = "mobile-nav";
}

function openLoginModal() {
  closeMobileNav();
  modalStore.openModal("login");
}

function openRegisterModal() {
  closeMobileNav();
  modalStore.openModal("register");
}

function closeMobileNav() {
  isMobileNavOpen.value = false;
  modalStore.closeModal();
}

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
.dropdown-menu {
  box-shadow: 1px 3px 10px rgba(0, 0, 0, 0.2);
}

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
