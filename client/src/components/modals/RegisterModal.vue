<template>
  <base-modal :modal-title="'Zarejestruj się'" :modal-name="'register'">
    <form action="/signup" id="signUpForm" @submit="onSubmit">
      <div class="mb-4">
        <label-field :label-for="'name'">Jak się nazywasz?</label-field>
        <input-text
          name="name"
          type="text"
          :placeholder="'Janek'"
          :input-props="{ minlength: 3, maxlength: 21 }"
          :input-id="'name'"
        ></input-text>
      </div>
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
        <label-field :label-for="'gender'">Płeć</label-field>
        <select-field
          name="gender"
          :initial-value="'female'"
          :custom-class="'w-full'"
          :select-id="'gender'"
        >
          <template #values>
            <option value="female">Kobieta</option>
            <option value="male">Mężczyzna</option>
          </template>
        </select-field>
      </div>
      <div class="mb-4">
        <label-field :label-for="'birthdate'">Data urodzenia</label-field>
        <input-text
          name="birthdate"
          type="date"
          :input-id="'birthdate'"
        ></input-text>
      </div>
      <div class="terms-container mb-4 grid gap-x-2">
        <input-text
          name="terms"
          type="checkbox"
          :custom-class="'mb-4'"
          :custom-error-class="'error-message-grid'"
          :input-id="'terms'"
        ></input-text>
        <label for="terms" class="text-xs min-[1330px]:text-sm">
          Rejestrując się w serwisie akceptuję
          <router-link
            :to="{ name: 'Terms' }"
            class="font-medium hover:text-primaryDark hover:underline active:text-primaryDark active:underline"
          >
            regulamin
          </router-link>
          i zgadzam się z polityką prywatności.
        </label>
      </div>
      <form-button
        class="w-full mb-1"
        :form-id="'signUpForm'"
        :button-title="'Załóż konto'"
      ></form-button>
      <div class="text-xs text-center min-[1330px]:text-sm">
        <p>
          Masz już konto?
          <router-link
            :to="''"
            class="font-medium hover:text-primaryDark hover:underline active:text-primaryDark active:underline"
            @click="openModal('login')"
          >
            Zaloguj się tutaj!
          </router-link>
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
import LabelField from "../form/LabelField.vue";
import SelectField from "@/components/form/SelectField.vue";
import FormButton from "@/components/settings/FormButton.vue";
import BaseModal from "@/components/modals/BaseModal.vue";

const router = useRouter();

const modalStore = useModalStore();
const userStore = useUserStore();

const { openModal } = modalStore;

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
