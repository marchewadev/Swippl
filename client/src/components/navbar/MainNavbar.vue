<template>
  <header
    class="flex items-center justify-between bg-white shadow-md shadow-gray-200 py-5 px-12"
  >
    <a href="#">
      <img
        src="../../assets/swippl-logo-light.png"
        alt="Swippl logo"
        class="h-9"
      />
    </a>

    <base-navbar class="flex items-center text-lg gap-5">
      <template #additional>
        <div>
          <p>1234 aktywnych osób</p>
        </div>
      </template>
      <template #links>
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
              class="cursor-pointer h-10 rounded-full"
            />
            <div
              v-show="dropdownOpen"
              class="absolute bg-white mt-2 w-48 rounded-md right-0 dropdown-menu"
              v-on-click-outside="closeDropdown"
              @click="dropdownOpen = false"
            >
              <ul>
                <navbar-link
                  :path="{ name: 'Profile' }"
                  :custom-class-link="'text-base block rounded-none rounded-tl-md rounded-tr-md flex items-center gap-2'"
                >
                  <template #icon>
                    <ion-icon name="person-outline" class="text-lg"></ion-icon>
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
      </template>
    </base-navbar>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { vOnClickOutside } from "@vueuse/components";
import { useModalStore } from "@/stores/ModalStore";
import { useUserStore } from "@/stores/UserStore";
import BaseNavbar from "./BaseNavbar.vue";
import NavbarLink from "./NavbarLink.vue";

const dropdownOpen = ref(false);
const modalStore = useModalStore();
const userStore = useUserStore();

function closeDropdown() {
  dropdownOpen.value = false;
}
</script>

<style scoped>
.dropdown-menu {
  box-shadow: 1px 3px 10px rgba(0, 0, 0, 0.2);
}
</style>
