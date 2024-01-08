<template>
  <base-modal :modal-title="'Zaloguj się'" :modal-name="'login'">
    <form action="/signin" id="signInForm" @submit="onSubmit">
      <div class="mb-4">
        <label for="" class="block mb-1">Adres e-mail</label>
        <input-text
          name="email"
          type="email"
          :placeholder="'kowalski@example.com'"
          :input-props="{ minlength: 3, maxlength: 254 }"
        ></input-text>
      </div>
      <div class="mb-1">
        <label for="" class="block mb-1">Hasło</label>
        <input-text
          name="password"
          type="password"
          :placeholder="'********'"
          :input-props="{ minlength: 8 }"
        ></input-text>
      </div>
      <div class="text-center mb-3">
        <a href="#" class="text-sm hover:underline hover:text-primaryDark">
          Nie pamiętam hasła
        </a>
      </div>
      <form-button
        :formId="'signInForm'"
        :buttonTitle="'Zaloguj się'"
        class="w-full mb-1"
      ></form-button>
      <div class="text-sm text-center">
        <p>
          Nie masz jeszcze konta?
          <a
            href="#"
            class="font-medium hover:underline hover:text-primaryDark"
            @click="modalStore.openModal('register')"
          >
            Możesz je założyć tutaj!
          </a>
        </p>
      </div>
    </form>
  </base-modal>
</template>

<script setup>
import { useForm } from "vee-validate";
import { object, string } from "yup";
import { useModalStore } from "@/stores/ModalStore";
import InputText from "@/components/form/InputText.vue";
import FormButton from "@/components/settings/FormButton.vue";
import BaseModal from "@/components/modals/BaseModal.vue";

const modalStore = useModalStore();

const { handleSubmit } = useForm({
  validationSchema: object({
    email: string()
      .required("Adres e-mail jest wymagany")
      .email("Niepoprawny adres e-mail")
      .min(3, "Adres e-mail jest zbyt krótki")
      .max(254, "Adres e-mail jest zbyt długi"),
    password: string()
      .required("Hasło jest wymagane")
      .min(8, "Hasło musi mieć co najmniej 8 znaków"),
  }),
});

const onSubmit = handleSubmit((values) => {
  console.log(JSON.stringify(values));
});
</script>
