<template>
  <form @submit="onSubmit" id="deleteAccountForm">
    <div class="mb-4">
      <label for="" class="block mb-1">Adres e-mail</label>
      <InputText
        name="email"
        type="email"
        :placeholder="'kowalski@example.com'"
        :inputProps="{ minlength: 3, maxlength: 254 }"
      />
    </div>
    <div class="mb-4">
      <label for="" class="block mb-1">Hasło</label>
      <InputText
        name="password"
        type="password"
        :placeholder="'********'"
        :inputProps="{ minlength: 8 }"
      />
    </div>
    <div class="mb-4">
      <label for="" class="block mb-1">Potwierdź hasło</label>
      <InputText
        name="password2"
        type="password"
        :placeholder="'********'"
        :inputProps="{ minlength: 8 }"
      />
    </div>
    <div class="mb-4">
      <label for="" class="block">Powód usunięcia konta</label>
      <SelectField name="reason" :initialValue="'1'" :customClass="'w-full'">
        <template #values>
          <option value="1">Nie podoba mi się</option>
          <option value="2">Nie chcę już korzystać</option>
          <option value="3">Inny</option>
        </template>
      </SelectField>
    </div>
    <FormButton
      :formId="'deleteAccountForm'"
      :buttonTitle="'Usuń konto'"
      :isRed="true"
      class="w-full"
    />
  </form>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { object, string, ref } from "yup";
import { useUserStore } from "@/stores/UserStore";
import InputText from "@/components/form/InputText.vue";
import FormButton from "@/components/settings/FormButton.vue";
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
  // console.log(JSON.stringify(values));
});
</script>
