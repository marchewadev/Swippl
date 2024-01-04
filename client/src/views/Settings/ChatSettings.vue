<template>
  <div class="settings-grid grid grid-cols-2 gap-x-16">
    <form @submit.prevent="handleSubmit" class="mb-10" id="searchCriteriaForm">
      <div class="criteria--age mb-10">
        <label for="" class="">Przedział wiekowy</label>
        <range-slider
          class="slider-blue mt-4 w-96"
          @handleAgeRange="handleFormAgeRange"
        ></range-slider>
      </div>
      <div class="criteria--gender">
        <label for="" class="mr-2">Szukaj według płci</label>
        <select
          name=""
          id=""
          required
          class="text-sm bg-gray-100 border border-gray-30 rounded p-2 mt-1 block cursor-pointer"
          v-model="genderSearch"
        >
          <option value="any">Dowolna</option>
          <option value="woman">Kobieta</option>
          <option value="male">Mężczyzna</option>
        </select>
      </div>
    </form>
    <button
      form="searchCriteriaForm"
      class="search-by-criteria--btn text-base p-2 rounded-md bg-primary text-gray-50 transition-colors duration-300"
      type="submit"
      :disabled="isFormInvalid"
      :class="{
        'opacity-50': isFormInvalid,
        'hover:bg-primaryLight': !isFormInvalid,
      }"
    >
      Szukaj według kryteriów
    </button>
    <button
      class="search-random--btn text-base p-2 rounded-md bg-secondary text-primaryDark hover:bg-secondaryLight transition-colors duration-300"
      type="button"
    >
      Szukaj dowolnie
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import RangeSlider from "@/components/settings/RangeSlider.vue";

const router = useRouter();

// Form fields
const minAgeSearch = ref(18);
const maxAgeSearch = ref(100);
const genderSearch = ref("any");

// Computed property that checks if the form is invalid
const isFormInvalid = computed(() => {
  return !(
    minAgeSearch.value >= 18 &&
    maxAgeSearch.value <= 100 &&
    ["any", "woman", "male"].includes(genderSearch.value)
  );
});

const handleSubmit = async () => {
  // await router.push("/chat");
  console.log(minAgeSearch.value, maxAgeSearch.value, genderSearch.value);
};

// Handle age range from RangeSlider component
const handleFormAgeRange = (value) => {
  minAgeSearch.value = value[0];
  maxAgeSearch.value = value[1];
};
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

.slider-blue {
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
