<template>
  <main-navbar></main-navbar>
  <main class="2xl:max-w-screen-2xl m-auto">
    <div class="grid grid-cols-2 justify-items-center items-center">
      <div>
        <h1 class="text-3xl mb-3 font-medium">Poznaj nowe osoby na Swippl</h1>
        <p class="text-base mb-5">
          Możesz tutaj zawierać nowe znajomości, całkowicie anonimowo. Jeżeli
          zechcesz, możesz również stworzyć swój własny, unikalny profil. Ty
          decydujesz, czym chcesz się podzielić!
        </p>
        <div>
          <home-button
            :path="'/chat'"
            :text="'Zacznij anonimowo'"
            class="text-gray-50 bg-primary hover:bg-primaryLight mr-5"
          ></home-button>
          <home-button
            :path="''"
            :text="'Załóż konto'"
            class="bg-secondary hover:bg-secondaryLight text-primaryDark"
            @click="modalStore.openModal('register')"
          ></home-button>
        </div>
      </div>
      <div>
        <img
          src="../assets/chat-showcase.png"
          alt="Showcase of an Swippl application"
        />
      </div>
    </div>

    <div class="mt-16">
      <h2 class="text-center text-2xl font-medium">
        Dlaczego warto założyć konto na Swippl?
      </h2>
      <div
        class="mt-7 grid grid-cols-3 justify-items-center gap-x-20 group [&>*:nth-child(odd)]:bg-primary [&>*:nth-child(odd)]:text-gray-50 [&>*:nth-child(even)]:text-primaryDark [&>*:nth-child(even)]:bg-secondary"
      >
        <card :icon-name="'people-outline'" :card-title="'Dowolność'">
          U nas masz możliwość wyboru z kim zechcesz rozmawiać. Wystarczy
          uzupełnić dane na profilu, wybrać opcje szukania i gotowe!
        </card>
        <card :icon-name="'person-outline'" :card-title="'Własny profil'">
          W każdej chwili możesz edytować swój profil, rozbudowując go o zdjęcie
          profilowe i nie tylko. Inni użytkownicy zdecydowanie to docenią!
        </card>
        <card
          :icon-name="'chatbubbles-outline'"
          :card-title="'Nowe znajomości'"
        >
          Jeżeli zechcesz, możesz dodać użytkownika do listy znajomych. Dzięki
          temu możecie kontynuować rozmowę później!
        </card>
      </div>
    </div>
  </main>
  <footer-el></footer-el>
</template>

<script setup>
import MainNavbar from "@/components/navbar/MainNavbar.vue";
import HomeButton from "@/components/buttons/HomeButton.vue";
import Card from "@/components/home/Card.vue";
import FooterEl from "@/components/footer/FooterEl.vue";
import { useModalStore } from "@/stores/ModalStore";

const modalStore = useModalStore();
</script>
