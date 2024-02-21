<template>
  <app-layout>
    <template #boxTitle>
      <div class="stranger max-w-fit flex items-center gap-2">
        <img
          :src="strangerProfileStore.getAvatar"
          alt="Stranger avatar"
          class="stranger--avatar rounded-full cursor-pointer min-[1600px]:h-12 h-10"
          @click="strangerProfileStore.openProfile"
        />
        <div>
          <h2
            class="stranger--name mr-1 inline-block min-[1600px]:text-lg text-base"
          >
            {{ strangerProfileStore.stranger.name }},
          </h2>
          <p class="stranger--age inline-block min-[1600px]:text-lg text-base">
            {{ strangerProfileStore.stranger.age }}
          </p>
        </div>
        <button class="flex" @click="strangerProfileStore.openProfile">
          <ion-icon
            name="information-outline"
            class="border border-primary rounded-full transition-colors duration-300 hover:bg-primary hover:text-gray-50 min-[1600px]:text-base text-sm"
          ></ion-icon>
        </button>
      </div>
      <div
        class="p-2 settings absolute left-full bottom-full -translate-x-full translate-y-full"
      >
        <router-link :to="{ name: 'Settings' }" class="settings--btn">
          <ion-icon
            name="settings-outline"
            class="settings--icon transition-transform duration-700 min-[1600px]:text-xl text-lg"
          ></ion-icon>
        </router-link>
      </div>
    </template>
    <template #boxContent>
      <div class="chat-container h-full grid">
        <div
          class="messages-wrapper px-6 pt-6 overflow-y-scroll grid grid-cols-2 auto-rows-min"
        >
          <message
            v-for="(message, index) in chatStore.messages"
            :key="index"
            :class="{
              'message-stranger': message.type === 'stranger',
              'message-user': message.type === 'user',
              'message-admin': message.type === 'admin',
            }"
          >
            {{ message.content }}
          </message>
        </div>
        <div
          class="message-compose flex items-center justify-center gap-4"
          ref="composeEl"
        >
          <div class="w-10/12 my-3 min-[1600px]:h-20 min-[851px]:h-16 h-14">
            <textarea
              name=""
              id=""
              cols="30"
              rows="10"
              placeholder="Hej, co tam?"
              maxlength="4096"
              class="bg-gray-100 w-full h-full p-2 rounded-lg resize-none"
              v-model="newMessage"
              @keydown.enter.prevent="sendMessage"
            ></textarea>
          </div>
          <button class="active:scale-110 transition-transform duration-200">
            <ion-icon
              name="send"
              class="min-[1600px]:text-2xl text-xl"
            ></ion-icon>
          </button>
        </div>
      </div>
    </template>
  </app-layout>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import AppLayout from "@/components/layouts/AppLayout.vue";
import Message from "@/components/chat/Message.vue";
import { useStrangerProfileStore } from "@/stores/StrangerProfileStore";
import { useChatStore } from "@/stores/ChatStore";
import socket from "@/sockets/socket";
import { useUserStore } from "@/stores/UserStore";
import { useRoute } from "vue-router";

const strangerProfileStore = useStrangerProfileStore();
const chatStore = useChatStore();

const newMessage = ref("");

const sendMessage = () => {
  if (newMessage.value.trim() !== "") {
    chatStore.sendPrivateMessage({
      message: newMessage.value,
    });
    newMessage.value = "";
  }
};

onMounted(() => {
  const userStore = useUserStore();
  const route = useRoute();
  chatStore.onJoinRoomError();

  watch(
    () => [route.params.friendID, route.params.sessionID],
    ([friendID, sessionID]) => {
      chatStore.getChatHistory({
        userID: userStore.user.id,
        friendID,
        sessionID: Number(sessionID),
      });
    }
  );

  // Automatically scroll to the bottom of the messages container
  const messagesWrapper = document.querySelector(".messages-wrapper");
  messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
  watch(
    () => chatStore.messages,
    async (newMessages, oldMessages) => {
      if (newMessages.length > oldMessages.length) {
        await nextTick();
        messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
      }
    }
  );
  chatStore.generatePrivateMessage();
});

onUnmounted(() => {
  strangerProfileStore.resetStrangerData();
  chatStore.privateSessionID = null;
  chatStore.activeFriendID = null;
  chatStore.messages = [];
  socket.off("generatePrivateMessage");
});
</script>

<style scoped>
.settings--btn:hover .settings--icon {
  transform: rotate(360deg);
}

.messages-wrapper {
  scrollbar-width: thin;
}

.chat-container {
  grid-template-rows: 1fr auto;
}
</style>
