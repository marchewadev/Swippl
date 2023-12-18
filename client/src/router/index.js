import { createRouter, createWebHistory } from "vue-router";
import HomeVue from "@/views/Home.vue";
import ChatVue from "@/views/Chat.vue";
import NotFoundVue from "@/views/NotFound.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeVue,
    },
    {
      path: "/chat",
      name: "Chat",
      component: ChatVue,
    },
    {
      path: "/:catchAll(.*)",
      name: "NotFound",
      component: NotFoundVue,
    },
  ],
});

export default router;
