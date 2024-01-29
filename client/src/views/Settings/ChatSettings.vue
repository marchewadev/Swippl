<template>
  <div class="settings-grid grid grid-cols-2 gap-x-16">
    <form id="searchCriteriaForm" class="mb-10" @submit="onSubmit">
      <div class="criteria--age mb-10">
        <label for="" class="">Przedział wiekowy</label>
        <range-slider
          class="slider-yellow mt-4 w-96"
          :name="'ageRangeSearch'"
          :initial-value="ageRangeValue"
          @change="updateAgeRange"
        ></range-slider>
      </div>
      <div class="criteria--gender">
        <label for="">Szukaj według płci</label>
        <select-field
          name="genderSearch"
          :initial-value="userStore.searchCriteria.genderSearch"
          @change="updateGender"
        >
          <template #values>
            <option value="any">Dowolna</option>
            <option value="female">Kobieta</option>
            <option value="male">Mężczyzna</option>
          </template>
        </select-field>
      </div>
    </form>
    <form-button
      :formId="'searchCriteriaForm'"
      :buttonTitle="'Szukaj według kryteriów'"
      class="search-by-criteria--btn"
    ></form-button>
    <button
      class="search-random--btn text-base p-2 rounded-md bg-secondary text-primaryDark hover:bg-secondaryLight transition-colors duration-300"
      type="button"
    >
      Szukaj dowolnie
    </button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { useUserStore } from "@/stores/UserStore";
import { object, string, number, array } from "yup";
import RangeSlider from "@/components/settings/RangeSlider.vue";
import SelectField from "@/components/form/SelectField.vue";
import FormButton from "@/components/settings/FormButton.vue";
import { useModalStore } from "@/stores/ModalStore";

const router = useRouter();
const userStore = useUserStore();
const modalStore = useModalStore();

const ageRangeValue = userStore.searchCriteria.ageRangeSearch;
const { handleSubmit } = useForm({
  initialValues: {
    ageRangeSearch: ageRangeValue,
  },
  validationSchema: object({
    ageRangeSearch: array()
      .of(
        number()
          .min(18, "Minimalny wiek szukania wynosi 18 lat")
          .max(100, "Maksymalny wiek szukania wynosi 100 lat")
      )
      .required("Przedział wiekowy jest wymagany"),
    genderSearch: string()
      .oneOf(["any", "female", "male"], "Niepoprawna płeć")
      .trim()
      .required("Płeć jest wymagana"),
  }),
});

const updateAgeRange = (newAgeRange) => {
  userStore.searchCriteria.ageRangeSearch = newAgeRange;
};
const updateGender = (newGender) => {
  userStore.searchCriteria.genderSearch = newGender;
};

const onSubmit = handleSubmit((values) => {
  if (
    (!userStore.user.gender || !userStore.user.birthdate) &&
    !userStore.token
  ) {
    modalStore.openModal("chat-anonymously");
  } else {
    router.push("/chat");
  }
});
</script>

<style scoped>
.settings-grid {
  grid-template-rows: 1fr auto;
}

form {
  grid-column: 1;
  grid-row: 1;
}

.search-by-criteria--btn {
  grid-column: 1;
  grid-row: 2;
}

.search-random--btn {
  grid-column: 2;
  grid-row: 2;
}

.slider-yellow {
  --slider-connect-bg: #ffc131;
  --slider-tooltip-bg: #313d51;
  --slider-handle-ring-color: #ffc131;
  --slider-height: 4px;
  --slider-handle-width: 12px;
  --slider-handle-height: 12px;
  --slider-handle-ring-width: 2px;
  --slider-tooltip-font-size: 0.7rem;
}
</style>
