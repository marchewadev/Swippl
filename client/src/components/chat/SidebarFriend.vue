<template>
  <div class="p-2">
    <div
      class="friend-sidebar py-4 px-2 rounded-xl transition-colors duration-200 cursor-pointer hover:bg-gray-100 active:bg-gray-100 grid"
      :class="{ 'bg-gray-100': props.friend_id === chatStore.activeFriendID }"
      @click="handleClick"
    >
      <img
        :src="setFriendAvatar"
        alt="Friend's avatar"
        class="friend-avatar h-10 mr-2 rounded-full aspect-square min-[1600px]:h-12"
      />
      <p
        class="friend-name h-min text-sm text-ellipsis font-medium overflow-hidden min-[1600px]:text-base"
      >
        {{ friend_name }}
      </p>
      <p
        class="message text-xs text-ellipsis whitespace-nowrap overflow-hidden min-[1600px]:text-sm"
      >
        {{ latestMessage }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useChatStore } from "@/stores/ChatStore";
import { useUserStore } from "@/stores/UserStore";
import defaultAvatar from "@/assets/images/avatar.png";
import socket from "@/sockets/socket";

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

  friend_avatar: {
    type: String,
    required: true,
  },

  session_id: {
    type: Number,
    required: true,
  },
});

const setFriendAvatar = computed(() => {
  return props.friend_avatar ? props.friend_avatar : defaultAvatar;
});

const handleClick = () => {
  router.push({
    name: "PrivateChat",
    params: { friendID: props.friend_id, sessionID: props.session_id },
  });
};

const setLatestMessage = () => {
  const friend = userStore.friends.find(
    (friend) => friend.id === props.friend_id
  );

  if (friend) latestMessage.value = friend.latestMessage.message_content;
};

setLatestMessage();

onMounted(() => {
  socket.on("generatePrivateMessage", (messageObject) => {
    const friend = userStore.friends.find(
      (friend) => friend.sessionID === messageObject.sessionID
    );

    if (friend) latestMessage.value = messageObject.content;

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
