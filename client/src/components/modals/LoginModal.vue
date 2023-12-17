<template>
  <base-modal :modal-title="'Zaloguj się'" :modal-name="'login'">
    <form action="/signin" class="flex flex-col">
      <label for="" class="text-base mb-1">Adres e-mail</label>
      <input
        type="email"
        placeholder="kowalski@example.com"
        class="text-sm p-2 bg-gray-100 rounded-md border border-gray-300 mb-4"
      />
      <label for="" class="text-base mb-1">Hasło</label>
      <input
        type="password"
        placeholder="********"
        class="text-sm p-2 bg-gray-100 rounded-md border border-gray-300 mb-1"
      />
      <div class="text-center mb-3">
        <a href="#" class="text-sm hover:underline hover:text-primaryDark"
          >Nie pamiętam hasła</a
        >
      </div>
      <button
        class="text-base bg-primary text-gray-50 p-2 mb-1 rounded-md transition-colors duration-300 hover:bg-primaryLight"
      >
        Zaloguj się
      </button>
      <p class="text-sm text-center">
        Nie masz jeszcze konta?
        <a href="#" class="font-medium hover:underline hover:text-primaryDark"
          >Możesz je założyć tutaj!</a
        >
      </p>
    </form>
  </base-modal>
</template>

<script setup>
import BaseModal from "./BaseModal.vue";
</script>
