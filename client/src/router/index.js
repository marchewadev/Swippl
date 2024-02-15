import axios from "axios";
import { createRouter, createWebHistory } from "vue-router";
import { useSettingsStore } from "@/stores/SettingsStore";
import { useUserStore } from "@/stores/UserStore";
import { useChatStore } from "@/stores/ChatStore";

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
      path: "/private-chat/user/:friendID/session/:sessionID",
      name: "PrivateChat",
      component: () => import("@/views/PrivateChat.vue"),
      beforeEnter: (to, from) => {
        const chatStore = useChatStore();
        const userStore = useUserStore();

        if (userStore.token) {
          chatStore.getChatHistory({
            userID: userStore.user.id,
            friendID: to.params.friendID,
            sessionID: Number(to.params.sessionID),
          });
        }
      },
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

router.beforeEach(async (to, from, next) => {
  const settingsStore = useSettingsStore();
  const userStore = useUserStore();
  const chatStore = useChatStore();

  const token = userStore.token;
  const authRequiredRoutes = settingsStore.buttons
    .filter((button) => button.requiresAuth)
    .map((button) => `/settings/${button.path}`);
  authRequiredRoutes.push("/private-chat/user/:friendID/session/:sessionID");

  if (!token) {
    const requiresAuth = authRequiredRoutes.some((route) => {
      const regex = new RegExp(`^${route.replace(/:[^/]+/g, "[^/]+")}$`);
      return regex.test(to.path);
    });

    if (requiresAuth) {
      next("/");
    } else {
      next();
    }
  } else {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_SERVER}/user/verify`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      userStore.friends = response.data.friendsObject;
      userStore.setUserData(response.data.userObject);
      chatStore.createUserSession();
      if (to.name === "Home") {
        next("/settings");
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      userStore.resetUserStore();
      next("/");
    }
  }
});

export default router;
