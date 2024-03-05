<template>
  <section class="mb-4">
    <h3 class="text-lg font-medium mb-2 min-[1330px]:text-xl">
      <slot name="heading"></slot>
    </h3>
    <slot name="additional-info"></slot>
    <ul>
      <slot name="list-items"></slot>
    </ul>
  </section>
</template>
