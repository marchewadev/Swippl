<template>
  <app-layout>
    <template #boxTitle>
      <div
        class="stranger max-w-fit flex items-center gap-2"
        v-if="!chatStore.isSearching"
      >
        <img
          :src="strangerProfileStore.getAvatar"
          alt="Stranger avatar"
          class="stranger--avatar h-12 rounded-full cursor-pointer"
          @click="strangerProfileStore.openProfile"
        />
        <div>
          <h2 class="stranger--name text-lg mr-1 inline-block">
            {{ strangerProfileStore.stranger.name }},
          </h2>
          <p class="stranger--age text-lg inline-block">
            {{ strangerProfileStore.stranger.age }}
          </p>
        </div>
        <button class="flex" @click="strangerProfileStore.openProfile">
          <ion-icon
            name="information-outline"
            class="text-base border border-primary rounded-full transition-colors duration-300 hover:bg-primary hover:text-gray-50"
          ></ion-icon>
        </button>
      </div>
      <div
        class="py-2 settings flex items-center gap-1 absolute left-full bottom-full -translate-x-full translate-y-full"
      >
        <router-link :to="{ name: 'Settings' }" class="settings--btn">
          <ion-icon
            name="settings-outline"
            class="settings--icon text-xl transition-transform duration-700"
          ></ion-icon>
        </router-link>

        <button
          class="disconnect--btn transition-colors duration-300 hover:text-red-700"
          @click="chatStore.changeRoom"
        >
          <ion-icon name="close-outline" class="text-2xl"></ion-icon>
        </button>
      </div>
    </template>
    <template #boxContent>
      <loading-screen v-if="chatStore.isSearching"></loading-screen>
      <div
        class="chat-container h-full grid 5xl:grid-rows-chat-layout-xl 4xl:grid-rows-chat-layout-lg"
        v-if="!chatStore.isSearching"
      >
        <div
          class="messages-wrapper px-6 pt-6 overflow-y-scroll grid grid-cols-2 auto-rows-min"
        >
          <message class="message-admin">
            Pamiętaj, aby zachowywać się w sposób stosowny! Możesz w szybki
            sposób zmienić swojego rozmówcę wciskając dwa razy klawisz
            <strong>ESC</strong> bądź klikając przycisk <strong>X</strong> w
            prawym górnym rogu.
          </message>
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
          <div class="w-10/12 h-20 my-3">
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
              :disabled="chatStore.roomUsers < 2"
              :class="{ 'opacity-50': chatStore.roomUsers < 2 }"
            ></textarea>
          </div>
          <button
            :disabled="chatStore.roomUsers < 2"
            :class="{
              'opacity-50': chatStore.roomUsers < 2,
              'active:scale-110 transition-transform duration-200':
                chatStore.roomUsers === 2,
            }"
          >
            <ion-icon name="send" class="text-2xl"></ion-icon>
          </button>
        </div>
      </div>
    </template>
  </app-layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import AppLayout from "@/components/layouts/AppLayout.vue";
import Message from "@/components/chat/Message.vue";
import { useStrangerProfileStore } from "@/stores/StrangerProfileStore";
import { useChatStore } from "@/stores/ChatStore";
import LoadingScreen from "@/components/chat/LoadingScreen.vue";

const strangerProfileStore = useStrangerProfileStore();
const chatStore = useChatStore();

const newMessage = ref("");

watch(
  () => chatStore.roomUsers,
  (newVal, oldVal) => {
    if (newVal === 2) {
      chatStore.isSearching = false;
    }
  }
);

const sendMessage = () => {
  if (newMessage.value.trim() !== "") {
    chatStore.sendMessage(newMessage.value);
    newMessage.value = "";
  }
};

onMounted(() => {
  chatStore.joinRoom();
});

onUnmounted(() => {
  chatStore.leaveRoom();
});
</script>

<style scoped>
.settings--btn:hover .settings--icon {
  transform: rotate(360deg);
}

.messages-wrapper {
  scrollbar-width: thin;
}
</style>
