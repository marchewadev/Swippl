<template>
  <app-layout>
    <template #boxTitle>
      <div class="stranger max-w-fit flex items-center gap-2">
        <img
          src="@/assets/avatar.png"
          alt="Stranger avatar"
          class="stranger--avatar h-12 rounded-full"
        />
        <div>
          <h2 class="stranger--name text-lg mr-1 inline-block">Andrzej,</h2>
          <p class="stranger--age text-lg inline-block">18</p>
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
        <button class="settings--btn">
          <ion-icon
            name="settings-outline"
            class="settings--icon text-xl transition-transform duration-700"
          ></ion-icon>
        </button>

        <button class="transition-colors duration-300 hover:text-red-700">
          <ion-icon name="close-outline" class="text-2xl"></ion-icon>
        </button>
      </div>
    </template>
    <template #boxContent>
      <div
        class="chat-container h-full grid 5xl:grid-rows-chat-layout-xl 4xl:grid-rows-chat-layout-lg"
        ref="boxEl"
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
            ></textarea>
          </div>
          <button class="active:scale-110 transition-transform duration-200">
            <ion-icon name="send" class="text-2xl"></ion-icon>
          </button>
        </div>
      </div>
    </template>
  </app-layout>
</template>

<script setup>
import AppLayout from "@/components/layouts/AppLayout.vue";
import Message from "@/components/chat/Message.vue";
import { useStrangerProfileStore } from "@/stores/StrangerProfileStore";

const strangerProfileStore = useStrangerProfileStore();
</script>

<style scoped>
.settings--btn:hover .settings--icon {
  transform: rotate(360deg);
}

/* .chat-container {
  grid-template-rows: 70vh auto;
} */

.messages-wrapper {
  scrollbar-width: thin;
}
</style>
