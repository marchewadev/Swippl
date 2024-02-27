<template>
  <header
    class="bg-white shadow-md shadow-gray-200 px-2.5 py-2.5 flex items-center justify-between min-[851px]:px-8 min-[851px]:py-4 min-[1600px]:px-12 min-[1600px]:py-5"
  >
    <a href="#">
      <img
        src="../../assets/swippl-logo-light.png"
        alt="Swippl logo"
        class="h-6 min-[400px]:h-7 min-[1200px]:h-9"
      />
    </a>

    <base-navbar
      class="text-xs flex items-center gap-2.5 min-[400px]:text-sm min-[851px]:gap-5 min-[1200px]:text-base min-[1600px]:text-lg"
    >
      <template #additional>
        <div>
          <p v-if="totalUsers === 1">{{ totalUsers }} aktywna osoba</p>
          <p v-else-if="totalUsers < 5">{{ totalUsers }} aktywne osoby</p>
          <p v-else>{{ totalUsers }} aktywnych osób</p>
        </div>
      </template>
      <template #links>
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
                  <a href="#" class="w-fit block">
                    <img
                      src="../../assets/swippl-logo-light.png"
                      alt="Swippl logo"
                      class="h-6 min-[400px]:h-7 min-[1200px]:h-9"
                    />
                  </a>
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
                <div
                  class="friends h-full bg-inherit"
                  v-show="isFriendListOpen"
                >
                  <!-- TODO: rozważyć poprawę według VueJS Style Guide: nie łączyć v-if z v-for -->
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
                  <mobile-nav-button :path="{}">O nas</mobile-nav-button>
                  <mobile-nav-button :path="{}">Kontakt</mobile-nav-button>
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

        <div class="flex items-center gap-1 max-[850px]:hidden">
          <navbar-link :path="{}">
            <template #title>O nas</template>
          </navbar-link>
          <navbar-link :path="{}">
            <template #title>Kontakt</template>
          </navbar-link>
          <navbar-link
            v-if="!checkIfUserIsLoggedIn"
            :path="{}"
            @click="openModal('login')"
          >
            <template #title>Zaloguj się</template>
          </navbar-link>
          <navbar-link
            v-if="!checkIfUserIsLoggedIn"
            :path="{}"
            @click="openModal('register')"
          >
            <template #title>Zarejestruj się</template>
          </navbar-link>
          <li v-if="checkIfUserIsLoggedIn">
            <div class="relative">
              <img
                :src="userAvatar"
                alt="User's avatar"
                class="cursor-pointer h-10 rounded-full"
                v-on-click-outside="closeDropdown"
                @click="dropdownOpen = !dropdownOpen"
              />
              <div
                class="absolute bg-white mt-2 w-48 rounded-md right-0 dropdown-menu z-20"
                v-show="dropdownOpen"
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
                    @click="resetUserStore"
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
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
import { vOnClickOutside } from "@vueuse/components";
import { storeToRefs } from "pinia";
import { useModalStore } from "@/stores/ModalStore";
import { useUserStore } from "@/stores/UserStore";
import { useChatStore } from "@/stores/ChatStore";
import BaseNavbar from "./BaseNavbar.vue";
import MobileNavButton from "../buttons/MobileNavButton.vue";
import NavbarLink from "./NavbarLink.vue";
import SidebarFriend from "../chat/SidebarFriend.vue";

const modalStore = useModalStore();
const userStore = useUserStore();
const chatStore = useChatStore();

const { checkIfUserIsLoggedIn, resetUserStore } = userStore;
const { openModal } = modalStore;
const { friends, userAvatar } = storeToRefs(userStore);
const { totalUsers } = storeToRefs(chatStore);
const { showModal, selectedModal } = storeToRefs(modalStore);

const dropdownOpen = ref(false);
const isMobileNavOpen = ref(false);
const isFriendListOpen = ref(false);

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
  showModal.value = true;
  selectedModal.value = "mobile-nav";
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
