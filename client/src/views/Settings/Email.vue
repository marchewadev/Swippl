<template>
  <form @submit="onSubmit" id="emailChangeForm">
    <div class="mb-4">
      <label for="" class="block mb-1">Nowy adres e-mail</label>
      <InputText
        name="email"
        type="email"
        :placeholder="'kowalski@example.com'"
      />
    </div>
    <div class="mb-4">
      <label for="" class="block mb-1">Potwierdź adres e-mail</label>
      <InputText
        name="email2"
        type="email"
        :placeholder="'kowalski@example.com'"
      />
    </div>
    <div class="mb-4">
      <label for="" class="block mb-1">Podaj hasło</label>
      <InputText name="password" type="password" :placeholder="'********'" />
    </div>
    <FormButton
      :formId="'emailChangeForm'"
      :buttonTitle="'Zmień adres e-mail'"
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
    email: string().required().email(),
    email2: string()
      .required()
      .email()
      .oneOf([ref("email")], "Adresy e-mail muszą być takie same"),
    password: string().required(),
  }),
});

const onSubmit = handleSubmit((values) => {
  console.log(JSON.stringify(values));
});
</script>
