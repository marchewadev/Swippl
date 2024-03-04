<template>
  <base-modal :modal-title="'Zaloguj się'" :modal-name="'login'">
    <form action="/signin" id="signInForm" @submit="onSubmit">
      <div class="mb-4">
        <label-field>Adres e-mail</label-field>
        <input-text
          name="email"
          type="email"
          :placeholder="'kowalski@example.com'"
          :input-props="{ minlength: 3, maxlength: 254 }"
        ></input-text>
      </div>
      <div class="mb-1">
        <label-field>Hasło</label-field>
        <input-text
          name="password"
          type="password"
          :placeholder="'********'"
          :input-props="{ minlength: 8 }"
        ></input-text>
      </div>
      <div class="text-center mb-3">
        <router-link
          :to="{ name: 'ResetPassword' }"
          class="text-xs hover:text-primaryDark hover:underline min-[1330px]:text-sm"
        >
          Nie pamiętam hasła
        </router-link>
      </div>
      <form-button
        class="w-full mb-1"
        :form-id="'signInForm'"
        :button-title="'Zaloguj się'"
      ></form-button>
      <div class="text-xs text-center min-[1330px]:text-sm">
        <p>
          Nie masz jeszcze konta?
          <router-link
            :to="''"
            class="font-medium hover:text-primaryDark hover:underline"
            @click="openModal('register')"
          >
            Możesz je założyć tutaj!
          </router-link>
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
import LabelField from "../form/LabelField.vue";
import FormButton from "@/components/settings/FormButton.vue";
import BaseModal from "@/components/modals/BaseModal.vue";

const router = useRouter();

const modalStore = useModalStore();
const userStore = useUserStore();

const { openModal } = modalStore;

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
});
</script>
