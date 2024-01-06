<template>
  <Slider
    v-model="value"
    :min="18"
    :max="100"
    :step="1"
    :tooltips="true"
    :showTooltip="'always'"
    :tooltipPosition="'bottom'"
    @change="handleChange"
  />
</template>

<script setup>
import { useFieldArray } from "vee-validate";
import Slider from "@vueform/slider";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  initialValue: {
    type: Array,
    required: true,
  },
});
const value = props.initialValue;

const { update } = useFieldArray(() => props.name);

const handleChange = (values) => {
  values.forEach((value, index) => update(index, value));
};
</script>

<style src="@vueform/slider/themes/default.css"></style>
