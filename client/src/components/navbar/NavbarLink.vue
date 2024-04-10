<template>
  <li>
    <router-link
      :to="path"
      :class="[
        'p-2 rounded-md hover:text-gray-50 active:text-gray-50 hover:bg-primary hover:transition-colors duration-150 group-[.is-settings]:bg-gray-100 group-[.is-settings]:hover:bg-primary group-[.is-settings]:active:bg-primary group-[.is-settings]:flex group-[.is-settings]:items-center group-[.is-settings]:gap-2 group-[.is-red]:hover:!bg-red-700 group-[.is-red]:active:!bg-red-700',
        customClassLink,
      ]"
      :active-class="setActiveClass(path)"
      @click="handleClick"
    >
      <slot name="icon"></slot>
      <slot name="title"></slot>
    </router-link>
  </li>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

defineProps({
  path: {
    type: Object,
    required: true,
  },

  customClassLink: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["click"]);

const setActiveClass = ({ path }) => {
  if (path === route.path) {
    if (path.includes("delete-account")) {
      return "!bg-red-700 !text-gray-50";
    }
    return "!bg-primary !text-gray-50";
  }
  return "";
};

const handleClick = () => {
  emit("click");
};
</script>
