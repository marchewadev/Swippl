<template>
  <form @submit="onSubmit" id="emailChangeForm">
    <div class="mb-4">
      <label for="" class="block mb-1">Nowy adres e-mail</label>
      <InputText
        name="email"
        type="email"
        :placeholder="'kowalski@example.com'"
        :inputProps="{ minlength: 3, maxlength: 254 }"
      />
    </div>
    <div class="mb-4">
      <label for="" class="block mb-1">Potwierdź adres e-mail</label>
      <InputText
        name="email2"
        type="email"
        :placeholder="'kowalski@example.com'"
        :inputProps="{ minlength: 3, maxlength: 254 }"
      />
    </div>
    <div class="mb-4">
      <label for="" class="block mb-1">Podaj hasło</label>
      <InputText
        name="password"
        type="password"
        :placeholder="'********'"
        :inputProps="{ minlength: 8 }"
      />
    </div>
    <FormButton
      :formId="'emailChangeForm'"
      :buttonTitle="'Zmień adres e-mail'"
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
  // console.log(JSON.stringify(values));
});
</script>
