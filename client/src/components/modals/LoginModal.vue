<template>
  <base-modal :modal-title="'Zaloguj się'" :modal-name="'login'">
    <form action="/signin" id="signInForm" @submit="onSubmit">
      <div class="mb-4">
        <label for="" class="block mb-1 min-[1330px]:text-base text-sm"
          >Adres e-mail</label
        >
        <input-text
          name="email"
          type="email"
          :placeholder="'kowalski@example.com'"
          :input-props="{ minlength: 3, maxlength: 254 }"
        ></input-text>
      </div>
      <div class="mb-1">
        <label for="" class="block mb-1 min-[1330px]:text-base text-sm"
          >Hasło</label
        >
        <input-text
          name="password"
          type="password"
          :placeholder="'********'"
          :input-props="{ minlength: 8 }"
        ></input-text>
      </div>
      <div class="text-center mb-3">
        <a
          href="#"
          class="hover:underline hover:text-primaryDark min-[1330px]:text-sm text-xs"
        >
          Nie pamiętam hasła
        </a>
      </div>
      <form-button
        :formId="'signInForm'"
        :buttonTitle="'Zaloguj się'"
        class="w-full mb-1"
      ></form-button>
      <div class="text-center min-[1330px]:text-sm text-xs">
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
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { object, string } from "yup";
import { useModalStore } from "@/stores/ModalStore";
import { useUserStore } from "@/stores/UserStore";
import InputText from "@/components/form/InputText.vue";
import FormButton from "@/components/settings/FormButton.vue";
import BaseModal from "@/components/modals/BaseModal.vue";

const router = useRouter();

const modalStore = useModalStore();
const userStore = useUserStore();

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
  userStore.signInUser(router, values);
  // console.log(JSON.stringify(values));
});
</script>
