<template>
  <div
    class="text-center w-1/2 px-1 py-3 rounded-md shadow-lg shadow-black/20 transition-transform duration-300 hover:-translate-y-0.5 min-[500px]:px-2 min-[500px]:py-6 min-[700px]:w-full min-[900px]:px-4 min-[900px]:py-8 min-[1330px]:px-6 min-[1330px]:py-12"
  >
    <ion-icon
      :name="iconName"
      class="text-lg mb-1 min-[900px]:text-xl min-[1200px]:text-2xl min-[1600px]:text-3xl"
    ></ion-icon>
    <p
      class="text-sm mb-2 min-[900px]:text-base min-[1200px]:text-lg min-[1600px]:text-xl"
    >
      {{ cardTitle }}
    </p>
    <p
      class="text-xs tracking-tight min-[1200px]:text-sm min-[1600px]:text-base"
    >
      <slot></slot>
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  iconName: {
    type: String,
    required: true,
  },

  cardTitle: {
    type: String,
    required: true,
  },
});
</script>
