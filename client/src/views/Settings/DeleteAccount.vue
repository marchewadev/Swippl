<template>
  <form id="deleteAccountForm" @submit="onSubmit">
    <div class="mb-4">
      <label-field :label-for="'email'">Adres e-mail</label-field>
      <input-text
        name="email"
        type="email"
        :placeholder="'kowalski@example.com'"
        :input-props="{ minlength: 3, maxlength: 254 }"
        :input-id="'email'"
      ></input-text>
    </div>
    <div class="mb-4">
      <label-field :label-for="'password'">Hasło</label-field>
      <input-text
        name="password"
        type="password"
        :placeholder="'********'"
        :input-props="{ minlength: 8 }"
        :input-id="'password'"
      ></input-text>
    </div>
    <div class="mb-4">
      <label-field :label-for="'password2'">Potwierdź hasło</label-field>
      <input-text
        name="password2"
        type="password"
        :placeholder="'********'"
        :input-props="{ minlength: 8 }"
        :input-id="'password2'"
      ></input-text>
    </div>
    <div class="mb-4">
      <label-field :label-for="'reason'">Powód usunięcia konta</label-field>
      <select-field
        name="reason"
        :initial-value="'1'"
        :custom-class="'w-full'"
        :select-id="'reason'"
      >
        <template #values>
          <option value="1">Nie podoba mi się</option>
          <option value="2">Nie chcę już korzystać</option>
          <option value="3">Inny</option>
        </template>
      </select-field>
    </div>
    <form-button
      :form-id="'deleteAccountForm'"
      :button-title="'Usuń konto'"
      :is-red="true"
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
import FormButton from "@/components/settings/FormButton.vue";
import LabelField from "@/components/form/LabelField.vue";
import SelectField from "@/components/form/SelectField.vue";

const router = useRouter();
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
    password2: string()
      .required("Hasło jest wymagane")
      .min(8, "Hasło musi mieć co najmniej 8 znaków")
      .oneOf([ref("password")], "Hasła muszą być takie same"),
    reason: string()
      .required("Powód jest wymagany")
      .oneOf(["1", "2", "3"], "Niepoprawny powód"),
  }),
});

const onSubmit = handleSubmit((values) => {
  userStore.deleteUserAccount(router, values);
});
</script>
