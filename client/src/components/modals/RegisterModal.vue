<template>
  <base-modal :modal-title="'Zarejestruj się'" :modal-name="'register'">
    <form action="/signup" id="signUpForm" @submit="onSubmit">
      <div class="mb-4">
        <label for="" class="block mb-1 min-[1330px]:text-base text-sm"
          >Jak się nazywasz?</label
        >
        <input-text
          name="name"
          type="text"
          :placeholder="'Janek'"
          :input-props="{ minlength: 3, maxlength: 21 }"
        ></input-text>
      </div>
      <div class="mb-4">
        <label for="" class="block mb-1 min-[1330px]:text-base text-sm"
          >Adres e-mail</label
        >
        <input-text
          name="email"
          type="email"
          :placeholder="'kowalski@example.com'"
          :input-props="{ minlength: 3, maxlength: 254 }"
        ></input-text>
      </div>
      <div class="mb-4">
        <label for="" class="block mb-1 min-[1330px]:text-base text-sm"
          >Hasło</label
        >
        <input-text
          name="password"
          type="password"
          :placeholder="'********'"
          :input-props="{ minlength: 8 }"
        ></input-text>
      </div>
      <div class="mb-4">
        <label for="" class="block mb-1 min-[1330px]:text-base text-sm"
          >Potwierdź hasło</label
        >
        <input-text
          name="password2"
          type="password"
          :placeholder="'********'"
          :input-props="{ minlength: 8 }"
        ></input-text>
      </div>
      <div class="mb-4">
        <label for="" class="block mb-1 min-[1330px]:text-base text-sm"
          >Płeć</label
        >
        <select-field
          name="gender"
          :initial-value="'female'"
          :custom-class="'w-full'"
        >
          <template #values>
            <option value="female">Kobieta</option>
            <option value="male">Mężczyzna</option>
          </template>
        </select-field>
      </div>
      <div class="mb-4">
        <label for="" class="block mb-1 min-[1330px]:text-base text-sm"
          >Data urodzenia</label
        >
        <input-text name="birthdate" type="date"></input-text>
      </div>
      <div class="mb-4 grid terms-container gap-x-2">
        <input-text
          name="terms"
          type="checkbox"
          :custom-class="'mb-4'"
          :custom-error-class="'error-message-grid'"
        ></input-text>
        <label for="" class="min-[1330px]:text-sm text-xs">
          Rejestrując się w serwisie akceptuję
          <a
            href="#"
            class="font-medium hover:underline hover:text-primaryDark"
          >
            regulamin
          </a>
          i zgadzam się z
          <a
            href="#"
            class="font-medium hover:underline hover:text-primaryDark"
          >
            polityką prywatności </a
          >.
        </label>
      </div>
      <form-button
        :formId="'signUpForm'"
        :buttonTitle="'Załóż konto'"
        class="w-full mb-1"
      ></form-button>
      <div class="text-center min-[1330px]:text-sm text-xs">
        <p>
          Masz już konto?
          <a
            href="#"
            class="font-medium hover:underline hover:text-primaryDark"
            @click="modalStore.openModal('login')"
          >
            Zaloguj się tutaj!
          </a>
        </p>
      </div>
    </form>
  </base-modal>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { object, string, ref, date, boolean } from "yup";
import { useModalStore } from "@/stores/ModalStore";
import { useUserStore } from "@/stores/UserStore";
import dayjs from "dayjs";
import InputText from "@/components/form/InputText.vue";
import SelectField from "@/components/form/SelectField.vue";
import FormButton from "@/components/settings/FormButton.vue";
import BaseModal from "@/components/modals/BaseModal.vue";

const router = useRouter();

const modalStore = useModalStore();
const userStore = useUserStore();

const { handleSubmit } = useForm({
  validationSchema: object({
    name: string()
      .required("Imię jest wymagane")
      .min(3, "Imię jest za krótkie")
      .max(20, "Imię jest za długie")
      .trim(),
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
    gender: string()
      .oneOf(["female", "male"], "Niepoprawna płeć")
      .required("Płeć jest wymagana"),
    birthdate: date()
      .typeError("Data urodzenia musi być prawidłową datą")
      .required("Data urodzenia jest wymagana")
      .test(
        "is-18",
        "Musisz mieć co najmniej 18 lat",
        (value) => dayjs().diff(dayjs(value), "years") >= 18
      )
      .test(
        "is-less-than-100",
        "Nie możesz mieć więcej niż 100 lat",
        (value) => dayjs().diff(dayjs(value), "years") < 100
      ),
    terms: boolean()
      .required()
      .isTrue("Akceptacja regulaminu jest obowiązkowa"),
  }),
});

const onSubmit = handleSubmit((values) => {
  userStore.signUpUser(router, values);
});
</script>

<style scoped>
.terms-container {
  grid-template-columns: auto 1fr;
}
</style>
