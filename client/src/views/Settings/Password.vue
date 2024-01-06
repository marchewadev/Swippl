<template>
  <form @submit="onSubmit" id="passwordChangeForm">
    <div class="mb-4">
      <label for="" class="block mb-1">Stare hasło</label>
      <InputText name="oldPassword" type="password" :placeholder="'********'" />
    </div>
    <div class="mb-4">
      <label for="" class="block mb-1">Nowe hasło</label>
      <InputText name="newPassword" type="password" :placeholder="'********'" />
    </div>
    <div class="mb-4">
      <label for="" class="block mb-1">Potwierdź nowe hasło</label>
      <InputText
        name="newPassword2"
        type="password"
        :placeholder="'********'"
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
    oldPassword: string().required(),
    newPassword: string().required(),
    newPassword2: string()
      .required()
      .oneOf([ref("newPassword")], "Hasła muszą być takie same"),
  }),
});

const onSubmit = handleSubmit((values) => {
  console.log(JSON.stringify(values));
});
</script>
