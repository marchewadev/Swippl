<template>
  <base-modal
    :modal-title="'Czatuj anonimowo'"
    :modal-name="'chat-anonymously'"
  >
    <form action="" id="chatAnonymouslyForm" @submit="onSubmit">
      <div class="mb-4">
        <label-field>Płeć</label-field>
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
        <label-field>Data urodzenia</label-field>
        <input-text name="birthdate" type="date"></input-text>
      </div>
      <div class="terms-container mb-4 grid gap-x-2">
        <input-text
          name="terms"
          type="checkbox"
          :custom-class="'mb-4'"
          :custom-error-class="'error-message-grid'"
        ></input-text>
        <label for="" class="text-xs min-[1330px]:text-sm">
          Korzystając z serwisu akceptuję
          <router-link
            :to="{ name: 'Terms' }"
            class="font-medium hover:text-primaryDark hover:underline"
          >
            regulamin
          </router-link>
          i zgadzam się z polityką prywatności.
        </label>
      </div>
      <form-button
        class="w-full mb-1"
        :form-id="'chatAnonymouslyForm'"
        :button-title="'Zacznij rozmawiać'"
      ></form-button>
      <div class="text-xs text-center min-[1330px]:text-sm">
        <p>
          Masz już konto?
          <router-link
            :to="''"
            class="font-medium hover:text-primaryDark hover:underline"
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
import { object, string, date, boolean } from "yup";
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
