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
import { defineEmits } from "vue";
import Slider from "@vueform/slider";

const value = [18, 100];
const emit = defineEmits(["handleAgeRange"]);

const handleChange = (value) => {
  emit("handleAgeRange", value);
};
</script>

<style src="@vueform/slider/themes/default.css"></style>
