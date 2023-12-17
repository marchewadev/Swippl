<template>
  <base-modal :modal-title="'Zarejestruj się'" :modal-name="'register'">
    <form action="/signup" class="flex flex-col">
      <label for="" class="text-base mb-1">Jak się nazywasz?</label>
      <input
        type="text"
        placeholder="Janek"
        class="text-sm p-2 mb-4 rounded-md bg-gray-100 border border-gray-300"
      />
      <label for="" class="text-base mb-1">Adres e-mail</label>
      <input
        type="email"
        placeholder="kowalski@example.com"
        class="text-sm p-2 mb-4 rounded-md bg-gray-100 border border-gray-300"
      />
      <label for="" class="text-base mb-1">Hasło</label>
      <input
        type="password"
        placeholder="********"
        class="text-sm p-2 mb-4 bg-gray-100 rounded-md border border-gray-300"
      />
      <label for="" class="text-base mb-1">Powtórz hasło</label>
      <input
        type="password"
        placeholder="********"
        class="text-sm p-2 mb-4 bg-gray-100 rounded-md border border-gray-300"
      />
      <label for="">Data urodzenia</label>
      <input
        type="date"
        class="text-sm p-2 mb-4 bg-gray-100 rounded-md border border-gray-300"
      />
      <div class="mb-3 flex gap-2">
        <input type="checkbox" class="mb-4" />
        <label for="" class="text-sm">
          Rejestrując się w serwisie akceptuję
          <a href="#" class="font-medium hover:underline hover:text-primaryDark"
            >regulamin</a
          >
          i zgadzam się z
          <a href="#" class="font-medium hover:underline hover:text-primaryDark"
            >polityką prywatności</a
          >.
        </label>
      </div>
      <button
        class="text-base bg-primary text-gray-50 p-2 mb-1 rounded-md transition-colors duration-300 hover:bg-primaryLight"
      >
        Załóż konto
      </button>
      <p class="text-sm text-center">
        Masz już konto?
        <a href="#" class="font-medium hover:underline hover:text-primaryDark"
          >Zaloguj się tutaj!</a
        >
      </p>
    </form>
  </base-modal>
</template>

<script setup>
import BaseModal from "./BaseModal.vue";
</script>
