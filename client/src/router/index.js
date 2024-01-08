import { createRouter, createWebHistory } from "vue-router";
import { useSettingsStore } from "@/stores/SettingsStore";
import { useUserStore } from "@/stores/UserStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "/chat",
      name: "Chat",
      component: () => import("@/views/Chat.vue"),
    },
    {
      path: "/settings",
      name: "Settings",
      redirect: { name: "ChatSettings" },
      component: () => import("@/views/Settings/Settings.vue"),
      children: [
        {
          path: "chat-settings",
          name: "ChatSettings",
          component: () => import("@/views/Settings/ChatSettings.vue"),
        },
        {
          path: "profile",
          name: "Profile",
          component: () => import("@/views/Settings/Profile.vue"),
        },
        {
          path: "email",
          name: "Email",
          component: () => import("@/views/Settings/Email.vue"),
        },
        {
          path: "password",
          name: "Password",
          component: () => import("@/views/Settings/Password.vue"),
        },
        {
          path: "blocked-users",
          name: "BlockedUsers",
          component: () => import("@/views/Settings/BlockedUsers.vue"),
        },
        {
          path: "delete-account",
          name: "DeleteAccount",
          component: () => import("@/views/Settings/DeleteAccount.vue"),
        },
      ],
    },
    {
      path: "/:catchAll(.*)",
      name: "NotFound",
      component: () => import("@/views/NotFound.vue"),
    },
  ],
});

router.beforeEach((to) => {
  const settingsStore = useSettingsStore();
  const userStore = useUserStore();

  const authRequiredRoutes = settingsStore.buttons
    .filter((button) => button.requiresAuth)
    .map((button) => `/settings/${button.path}`);

  if (authRequiredRoutes.includes(to.path) && !userStore.isUserLoggedIn) {
    return { name: "ChatSettings" };
  }

  // If user is logged in and tries to go to Home, redirect to Settings
  if (to.name === "Home" && userStore.isUserLoggedIn) {
    return { name: "Settings" };
  }
});

export default router;
