<template>
  <!-- <div
    class="text-center py-12 px-6 rounded-md shadow-lg shadow-black/20 transition-transform duration-300 hover:-translate-y-0.5"
  > -->
  <div
    class="text-center rounded-md shadow-lg shadow-black/20 transition-transform duration-300 hover:-translate-y-0.5 min-[1330px]:py-12 min-[1330px]:px-6 min-[900px]:py-8 min-[900px]:px-4 min-[500px]:py-6 min-[500px]:px-2 min-[700px]:w-full w-1/2 px-1 py-3"
  >
    <ion-icon
      :name="iconName"
      class="mb-1 min-[1600px]:text-3xl min-[1200px]:text-2xl min-[900px]:text-xl text-lg"
    ></ion-icon>
    <p
      class="mb-2 min-[1600px]:text-xl min-[1200px]:text-lg min-[900px]:text-base text-sm"
    >
      {{ cardTitle }}
    </p>
    <p
      class="tracking-tight min-[1600px]:text-base min-[1200px]:text-sm text-xs"
    >
      <slot></slot>
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  iconName: String,
  cardTitle: String,
});
</script>
