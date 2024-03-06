<template>
  <div class="flex items-center gap-1 max-[850px]:hidden">
    <navbar-link :path="{ name: 'Terms', hash: '#contact' }">
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
          :src="setAvatarFn"
          alt="User's avatar"
          class="cursor-pointer h-10 rounded-full aspect-square"
          v-on-click-outside="closeDropdown"
          @click="isDropdownOpen = !isDropdownOpen"
        />
        <div
          class="absolute bg-white mt-2 w-48 rounded-md right-0 dropdown-menu z-20"
          v-show="isDropdownOpen"
        >
          <ul>
            <navbar-link
              :path="{ name: 'Profile' }"
              :custom-class-link="'block rounded-none rounded-tl-md rounded-tr-md flex items-center gap-2'"
            >
              <template #icon>
                <ion-icon name="person-outline" class="text-lg"></ion-icon>
              </template>
              <template #title>Profil</template>
            </navbar-link>
            <navbar-link
              :path="{ name: 'ChatSettings' }"
              :custom-class-link="'block rounded-none flex items-center gap-2'"
            >
              <template #icon>
                <ion-icon name="settings-outline" class="text-lg"></ion-icon>
              </template>
              <template #title>Ustawienia</template>
            </navbar-link>
            <navbar-link
              :path="{ name: 'Home' }"
              :custom-class-link="'block rounded-none rounded-bl-md rounded-br-md flex items-center gap-2'"
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

<script setup>
import { ref } from "vue";
import { vOnClickOutside } from "@vueuse/components";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/UserStore";
import { useModalStore } from "@/stores/ModalStore";
import { setAvatar } from "@/utils/setAvatar";
import defaultAvatar from "@/assets/images/avatar.png";
import NavbarLink from "./NavbarLink.vue";

const userStore = useUserStore();
const modalStore = useModalStore();

const { checkIfUserIsLoggedIn, resetUserStore } = userStore;
const { openModal } = modalStore;
const { userAvatar } = storeToRefs(userStore);

const isDropdownOpen = ref(false);

const setAvatarFn = setAvatar(userAvatar, defaultAvatar);

const closeDropdown = () => {
  isDropdownOpen.value = false;
};
</script>

<style scoped>
.dropdown-menu {
  box-shadow: 1px 3px 10px rgba(0, 0, 0, 0.2);
}
</style>
