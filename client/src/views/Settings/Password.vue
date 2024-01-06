<template>
  <form @submit="onSubmit" id="passwordChangeForm">
    <div class="mb-4">
      <label for="" class="block mb-1">Stare hasło</label>
      <InputText
        name="oldPassword"
        type="password"
        :placeholder="'********'"
        :inputProps="{ minlength: 8 }"
      />
    </div>
    <div class="mb-4">
      <label for="" class="block mb-1">Nowe hasło</label>
      <InputText
        name="newPassword"
        type="password"
        :placeholder="'********'"
        :inputProps="{ minlength: 8 }"
      />
    </div>
    <div class="mb-4">
      <label for="" class="block mb-1">Potwierdź nowe hasło</label>
      <InputText
        name="newPassword2"
        type="password"
        :placeholder="'********'"
        :inputProps="{ minlength: 8 }"
      />
    </div>
    <FormButton
      :formId="'passwordChangeForm'"
      :buttonTitle="'Zmień hasło'"
      class="w-full"
    />
  </form>
</template>

<script setup>
import { useForm } from "vee-validate";
import { object, string, ref } from "yup";
import InputText from "@/components/form/InputText.vue";
import FormButton from "@/components/settings/FormButton.vue";

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
  console.log(JSON.stringify(values));
});
</script>
