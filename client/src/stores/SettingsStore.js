import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settingsStore", {
  state: () => ({
    buttons: [
      {
        id: 1,
        title: "Rozmawiaj",
        path: "chat-settings",
        iconName: "chatbubbles-outline",
        isRed: false,
        requiresAuth: false,
      },
      {
        id: 2,
        title: "Profil",
        path: "profile",
        iconName: "happy-outline",
        isRed: false,
        requiresAuth: true,
      },
      {
        id: 3,
        title: "E-mail",
        path: "email",
        iconName: "mail-outline",
        isRed: false,
        requiresAuth: true,
      },
      {
        id: 4,
        title: "Hasło",
        path: "password",
        iconName: "lock-closed-outline",
        isRed: false,
        requiresAuth: true,
      },
      {
        id: 5,
        title: "Zablokowani",
        path: "blocked-users",
        iconName: "ban-outline",
        isRed: false,
        requiresAuth: true,
      },
      {
        id: 6,
        title: "Usuń konto",
        path: "delete-account",
        iconName: "trash-outline",
        isRed: true,
        requiresAuth: true,
      },
    ],
  }),
});
