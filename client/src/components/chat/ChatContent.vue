<template>
  <div class="chat-container h-full grid">
    <div
      class="messages-wrapper px-6 pt-6 overflow-y-scroll grid grid-cols-2 auto-rows-min"
      v-infinite-scroll="loadMoreMessages || (() => {})"
    >
      <message class="message-admin" v-if="isChatRouletteRoute">
        Pamiętaj, aby zachowywać się w sposób stosowny! Możesz w szybki sposób
        zmienić swojego rozmówcę klikając przycisk <strong>X</strong> w prawym
        górnym rogu.
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
      <div class="h-14 w-10/12 my-3 min-[851px]:h-16 min-[1600px]:h-20">
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          placeholder="Hej, co tam?"
          maxlength="4096"
          class="bg-gray-100 h-full w-full p-2 rounded-lg resize-none"
          :class="{ 'opacity-50': isChatRouletteRoute && roomUsers < 2 }"
          :disabled="isChatRouletteRoute && roomUsers < 2"
          ref="messageTextarea"
          v-model="newMessage"
          @keydown.enter.prevent="sendMessage"
        ></textarea>
      </div>
      <button
        :class="{
          'opacity-50': isChatRouletteRoute && roomUsers < 2,
          'transition-transform duration-200 active:scale-110':
            !isChatRouletteRoute || roomUsers === 2,
        }"
        :disabled="isChatRouletteRoute && roomUsers < 2"
        @click="sendMessage"
      >
        <ion-icon name="send" class="text-xl min-[1600px]:text-2xl"></ion-icon>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useChatStore } from "@/stores/ChatStore";
import { vInfiniteScroll } from "@vueuse/components";
import Message from "@/components/chat/Message.vue";

const props = defineProps({
  sendMessage: {
    type: Function,
    required: true,
  },

  loadMoreMessages: {
    type: Array,
    required: false,
  },
});

const route = useRoute();

const newMessage = ref("");
const messageTextarea = ref(null);

const chatStore = useChatStore();

const { roomUsers } = storeToRefs(chatStore);

const isChatRouletteRoute = computed(() => route.name === "Chat");

const focusTextarea = () => {
  messageTextarea.value.focus();
};

const sendMessage = () => {
  props.sendMessage(newMessage.value);
  newMessage.value = "";
};

onMounted(() => {
  focusTextarea();

  const messagesWrapper = document.querySelector(".messages-wrapper");
  messagesWrapper.scrollTop = messagesWrapper.scrollHeight;

  // Automatically scroll to the bottom of the messages container
  watch(
    () => chatStore.messages,
    async (newMessages, oldMessages) => {
      await nextTick();
      messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
    }
  );

  // Keep the scroll position when old messages are loaded
  let oldScrollTop = 0;
  let oldScrollHeight = 0;

  watch(
    () => chatStore.areMessagesLoading,
    (newValue, oldValue) => {
      if (newValue) {
        oldScrollTop = messagesWrapper.scrollTop;
        oldScrollHeight = messagesWrapper.scrollHeight;
      } else if (!newValue && oldValue) {
        nextTick().then(() => {
          const newScrollHeight = messagesWrapper.scrollHeight;
          messagesWrapper.scrollTop =
            oldScrollTop + (newScrollHeight - oldScrollHeight);
        });
      }
    }
  );
});
</script>

<style scoped>
.messages-wrapper {
  scrollbar-width: thin;
}

.chat-container {
  grid-template-rows: 1fr auto;
}
</style>
