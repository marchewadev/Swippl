<template>
  <div class="p-2">
    <div
      class="friend-sidebar cursor-pointer hover:bg-gray-100 py-4 px-2 grid rounded-xl transition-colors duration-200"
      :class="{ 'bg-gray-100': props.friend_id === chatStore.activeFriendID }"
      @click="handleClick"
    >
      <img
        src="@/assets/avatar.png"
        alt="Friend's avatar"
        class="friend-avatar h-12 rounded-full mr-2"
      />
      <p class="friend-name h-min font-medium">{{ friend_name }}</p>
      <p
        class="message text-sm whitespace-nowrap overflow-hidden text-ellipsis"
      >
        {{ latestMessage }}
      </p>
    </div>
  </div>
</template>

<script setup>
import socket from "@/sockets/socket";
import { useChatStore } from "@/stores/ChatStore";
import { useUserStore } from "@/stores/UserStore";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const chatStore = useChatStore();
const userStore = useUserStore();
const router = useRouter();

const latestMessage = ref("");

const props = defineProps({
  friend_name: {
    type: String,
    required: true,
  },
  friend_id: {
    type: Number,
    required: true,
  },
  session_id: {
    type: Number,
    required: true,
  },
});

const handleClick = () => {
  router.push({
    name: "PrivateChat",
    params: { friendID: props.friend_id, sessionID: props.session_id },
  });
};

const setLatestMessage = () => {
  latestMessage.value = userStore.friends.find(
    (friend) => friend.id === props.friend_id
  ).latestMessage.message_content;
};

setLatestMessage();

onMounted(() => {
  socket.on("generatePrivateMessage", (messageObject) => {
    userStore.friends.find(
      (friend) => friend.sessionID === messageObject.sessionID
    ).latestMessage.message_content = messageObject.content;

    setLatestMessage();
  });
});
</script>

<style scoped>
.friend-sidebar {
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
}

.friend-avatar {
  grid-column: 1;
  grid-row: 1 / -1;
}

.friend-name {
  grid-column: 2;
  grid-row: 1;
}

.message {
  grid-column: 2;
  grid-row: 2;
}
</style>
