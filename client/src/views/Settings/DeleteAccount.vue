<template>
  <form @submit="onSubmit" id="deleteAccountForm">
    <div class="mb-4">
      <label for="" class="block mb-1">Adres e-mail</label>
      <InputText
        name="email"
        type="email"
        :placeholder="'kowalski@example.com'"
      />
    </div>
    <div class="mb-4">
      <label for="" class="block mb-1">Hasło</label>
      <InputText name="password" type="password" :placeholder="'********'" />
    </div>
    <div class="mb-4">
      <label for="" class="block mb-1">Potwierdź hasło</label>
      <InputText name="password2" type="password" :placeholder="'********'" />
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
import { useForm } from "vee-validate";
import { object, string, ref } from "yup";
import InputText from "@/components/form/InputText.vue";
import FormButton from "@/components/settings/FormButton.vue";
import SelectField from "@/components/form/SelectField.vue";

const { handleSubmit } = useForm({
  validationSchema: object({
    email: string().required().email().trim(),
    password: string().required(),
    password2: string()
      .required()
      .oneOf([ref("password")], "Hasła muszą być takie same"),
    reason: string()
      .required()
      .trim()
      .oneOf(["1", "2", "3"], "Niepoprawny powód"),
  }),
});

const onSubmit = handleSubmit((values) => {
  console.log(JSON.stringify(values));
});
</script>
