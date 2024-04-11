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
import { PropType } from "vue";
import { useRoute } from "vue-router";
import { Path } from "@/interfaces/misc";

const route = useRoute();

defineProps({
  path: {
    type: Object as PropType<Path>,
    required: true,
  },

  customClassLink: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["click"]);
const handleClick = () => {
  emit("click");
};

const setActiveClass = ({ path }: Path) => {
  if (path === route.path) {
    if (path.includes("delete-account")) {
      return "!bg-red-700 !text-gray-50";
    }
    return "!bg-primary !text-gray-50";
  }
  return "";
};
</script>
