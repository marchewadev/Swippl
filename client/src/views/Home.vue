<template>
  <main-navbar></main-navbar>
  <main
    class="m-auto min-[1600px]:max-w-screen-2xl min-[1330px]:max-w-screen-xl min-[900px]:max-w-screen-md min-[500px]:max-w-screen-sm max-[700px]:mt-10"
  >
    <div
      class="grid justify-items-center items-center min-[700px]:grid-cols-2 max-[700px]:mx-auto max-[699px]:max-w-xs"
    >
      <div class="testgrida">
        <h1
          class="mb-3 font-medium min-[1600px]:text-3xl min-[1200px]:text-2xl min-[900px]:text-xl"
        >
          Poznaj nowe osoby na Swippl
        </h1>
        <p class="mb-5 min-[900px]:text-sm min-[1600px]:text-base text-xs">
          Możesz tutaj zawierać nowe znajomości, całkowicie anonimowo. Jeżeli
          zechcesz, możesz również stworzyć swój własny, unikalny profil. Ty
          decydujesz, czym chcesz się podzielić!
        </p>
        <div>
          <home-button
            :path="{ name: 'Settings' }"
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
      <div class="max-[699px]:hidden">
        <img
          src="../assets/chat-showcase.png"
          alt="Showcase of an Swippl application"
        />
      </div>
    </div>

    <div class="mt-16">
      <h2
        class="text-center font-medium min-[1200px]:text-xl min-[1600px]:text-2xl min-[900px]:text-lg"
      >
        Dlaczego warto założyć konto na Swippl?
      </h2>
      <div
        class="mt-7 grid justify-items-center group [&>*:nth-child(odd)]:bg-primary [&>*:nth-child(odd)]:text-gray-50 [&>*:nth-child(even)]:text-primaryDark [&>*:nth-child(even)]:bg-secondary min-[1330px]:gap-x-20 min-[900px]:gap-x-10 min-[700px]:gap-x-5 min-[700px]:grid-cols-3 grid-cols-1 min-[700px]:gap-y-0 gap-y-5"
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
