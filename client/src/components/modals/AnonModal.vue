<template>
  <base-modal
    :modal-title="'Czatuj anonimowo'"
    :modal-name="'chat-anonymously'"
  >
    <form action="" id="chatAnonymouslyForm" @submit="onSubmit">
      <div class="mb-4">
        <label for="" class="block mb-1">Płeć</label>
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
        <label for="" class="block mb-1">Data urodzenia</label>
        <input-text name="birthdate" type="date"></input-text>
      </div>
      <div class="mb-4 grid terms-container gap-x-2">
        <input-text
          name="terms"
          type="checkbox"
          :custom-class="'mb-4'"
          :custom-error-class="'error-message-grid'"
        ></input-text>
        <label for="" class="text-sm">
          Korzystając z serwisu akceptuję
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
        :formId="'chatAnonymouslyForm'"
        :buttonTitle="'Zacznij rozmawiać'"
        class="w-full mb-1"
      ></form-button>
      <div class="text-sm text-center">
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
import { object, string, date, boolean } from "yup";
import { useUserStore } from "@/stores/UserStore";
import dayjs from "dayjs";
import BaseModal from "@/components/modals/BaseModal.vue";
import InputText from "@/components/form/InputText.vue";
import SelectField from "@/components/form/SelectField.vue";
import FormButton from "@/components/settings/FormButton.vue";
import { useModalStore } from "@/stores/ModalStore";

const userStore = useUserStore();
const router = useRouter();
const modalStore = useModalStore();

const { handleSubmit } = useForm({
  validationSchema: object({
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
  userStore.setAnonData(values);
  modalStore.closeModal();
  router.push({ name: "Chat" });
});
</script>

<style scoped>
.terms-container {
  grid-template-columns: auto 1fr;
}
</style>
