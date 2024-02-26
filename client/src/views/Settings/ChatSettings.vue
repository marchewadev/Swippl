<template>
  <div class="settings-grid grid grid-cols-2 gap-x-8 min-[1600px]:gap-x-16">
    <form id="searchCriteriaForm" class="mb-10" @submit="onSubmit">
      <div class="criteria--age mb-10">
        <label for="" class="text-sm min-[1330px]:text-base"
          >Przedział wiekowy</label
        >
        <range-slider
          class="slider-yellow w-44 mt-4 min-[1000px]:w-52 min-[1200px]:w-72 min-[1600px]:w-96"
          :name="'ageRangeSearch'"
          :initial-value="ageRangeValue"
          @change="updateAgeRange"
        ></range-slider>
      </div>
      <div class="criteria--gender">
        <label for="" class="text-sm min-[1330px]:text-base"
          >Szukaj według płci</label
        >
        <select-field
          name="genderSearch"
          :initial-value="searchCriteria.genderSearch"
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
      :form-id="'searchCriteriaForm'"
      :button-title="'Szukaj według kryteriów'"
      class="search-by-criteria--btn"
    ></form-button>
    <button
      class="search-random--btn text-xs text-primaryDark bg-secondary p-2 rounded-md hover:bg-secondaryLight transition-colors duration-300 min-[1200px]:text-sm min-[1330px]:text-base"
      type="button"
    >
      Szukaj dowolnie
    </button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/UserStore";
import { useModalStore } from "@/stores/ModalStore";
import { useForm } from "vee-validate";
import { object, string, number, array } from "yup";
import SelectField from "@/components/form/SelectField.vue";
import FormButton from "@/components/settings/FormButton.vue";
import RangeSlider from "@/components/settings/RangeSlider.vue";

const router = useRouter();
const userStore = useUserStore();
const modalStore = useModalStore();

const { searchCriteria } = storeToRefs(userStore);

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

const onSubmit = handleSubmit(() => {
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

@media (max-width: 550px) {
  #searchCriteriaForm {
    margin-bottom: 1.25rem;
  }

  .search-random--btn {
    grid-column: 1;
    grid-row: 3;
  }

  .settings-grid {
    row-gap: 0.5rem;
    grid-template-columns: 1fr;
  }
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
