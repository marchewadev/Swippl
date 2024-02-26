<template>
  <form id="passwordChangeForm" @submit="onSubmit">
    <div class="mb-4">
      <label-field>Stare hasło</label-field>
      <input-text
        name="oldPassword"
        type="password"
        :placeholder="'********'"
        :input-props="{ minlength: 8 }"
      ></input-text>
    </div>
    <div class="mb-4">
      <label-field>Nowe hasło</label-field>
      <input-text
        name="newPassword"
        type="password"
        :placeholder="'********'"
        :input-props="{ minlength: 8 }"
      ></input-text>
    </div>
    <div class="mb-4">
      <label-field>Potwierdź nowe hasło</label-field>
      <input-text
        name="newPassword2"
        type="password"
        :placeholder="'********'"
        :inputProps="{ minlength: 8 }"
      ></input-text>
    </div>
    <form-button
      :form-id="'passwordChangeForm'"
      :button-title="'Zmień hasło'"
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
    oldPassword: string()
      .required("Hasło jest wymagane")
      .min(8, "Hasło musi mieć co najmniej 8 znaków"),
    newPassword: string()
      .required("Hasło jest wymagane")
      .min(8, "Hasło musi mieć co najmniej 8 znaków"),
    newPassword2: string()
      .required("Hasło jest wymagane")
      .min(8, "Hasło musi mieć co najmniej 8 znaków")
      .oneOf([ref("newPassword")], "Hasła muszą być takie same"),
  }),
});

const onSubmit = handleSubmit((values) => {
  userStore.updateUserPassword(router, values);
});
</script>
