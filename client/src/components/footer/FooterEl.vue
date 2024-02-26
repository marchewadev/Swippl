<template>
  <footer
    class="text-center text-gray-50 bg-primary py-3 px-5 mt-10 text-[10px] min-[500px]:px-10 min-[900px]:px-20 min-[1330px]:text-xs"
  >
    <p>
      Aby móc korzystać ze Swippl musisz mieć ukończone 18 lat. Korzystanie ze
      strony oznacza zgodę na wykorzystanie plików cookie. Rozpoczęcie rozmowy
      oznacza akceptację
      <a href="#" class="text-secondary">regulaminu</a>, a także zgodę na
      przetwarzanie danych, w tym danych osobowych (RODO). Więcej informacji
      możesz uzyskać na stronie naszej
      <a href="#" class="text-secondary">polityki prywatności</a>.
    </p>
    <p class="mt-1">
      Copyright &copy; <span id="copyright-year">{{ copyrightYear }}</span> by
      <a href="#" class="text-secondary font-semibold">Swippl</a>. All rights
      reserved.
    </p>
  </footer>
</template>

<script setup>
const copyrightYear = new Date().getFullYear();
</script>
