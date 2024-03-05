<template>
  <form id="emailChangeForm" @submit="onSubmit">
    <div class="mb-4">
      <label-field :label-for="'email'">Nowy adres e-mail</label-field>
      <input-text
        name="email"
        type="email"
        :placeholder="'kowalski@example.com'"
        :input-props="{ minlength: 3, maxlength: 254 }"
        :input-id="'email'"
      ></input-text>
    </div>
    <div class="mb-4">
      <label-field :label-for="'email2'">Potwierdź adres e-mail</label-field>
      <input-text
        name="email2"
        type="email"
        :placeholder="'kowalski@example.com'"
        :input-props="{ minlength: 3, maxlength: 254 }"
        :input-id="'email2'"
      ></input-text>
    </div>
    <div class="mb-4">
      <label-field :label-for="'password'">Podaj hasło</label-field>
      <input-text
        name="password"
        type="password"
        :placeholder="'********'"
        :input-props="{ minlength: 8 }"
        :input-id="'password'"
      ></input-text>
    </div>
    <form-button
      :form-id="'emailChangeForm'"
      :button-title="'Zmień adres e-mail'"
      class="w-full"
    ></form-button>
  </form>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { object, string, ref } from "yup";
import { useUserStore } from "@/stores/UserStore";
import InputText from "@/components/form/InputText.vue";
import LabelField from "@/components/form/LabelField.vue";
import FormButton from "@/components/settings/FormButton.vue";

const router = useRouter();
const userStore = useUserStore();

const { handleSubmit } = useForm({
  validationSchema: object({
    email: string()
      .required("Adres e-mail jest wymagany")
      .email("Niepoprawny adres e-mail")
      .min(3, "Adres e-mail jest zbyt krótki")
      .max(254, "Adres e-mail jest zbyt długi"),
    email2: string()
      .required("Adres e-mail jest wymagany")
      .email("Niepoprawny adres e-mail")
      .min(3, "Adres e-mail jest zbyt krótki")
      .max(254, "Adres e-mail jest zbyt długi")
      .oneOf([ref("email")], "Adresy e-mail muszą być takie same"),
    password: string()
      .required("Hasło jest wymagane")
      .min(8, "Hasło musi mieć co najmniej 8 znaków"),
  }),
});

const onSubmit = handleSubmit((values) => {
  userStore.updateUserEmail(router, values);
});
</script>
