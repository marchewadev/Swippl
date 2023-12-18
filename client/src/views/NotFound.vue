<template>
  <div class="flex-grow flex flex-col items-center justify-center relative">
    <h1 class="text-2xl text-gray-600 mb-1">
      Wystąpił mały problem, szeryfie...
    </h1>
    <p class="text-gray-600 text-xl">Strona o takim adresie nie istnieje.</p>
    <h2 class="text-10xl text-primaryLightest text-shadow">404</h2>
    <router-link
      :to="{ name: 'Home' }"
      class="text-base text-gray-50 bg-primary p-3 rounded-md transition-all duration-300 hover:bg-primaryLight"
    >
      Zabierz mnie z powrotem
    </router-link>
  </div>
</template>

<style scoped>
.text-shadow {
  text-shadow: 10px 5px 3px rgba(56, 70, 93, 0.15);
}
</style>
