<template>
  <footer class="text-sm text-center text-gray-50 bg-primary p-6 mt-auto">
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
