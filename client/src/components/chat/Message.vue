<template>
  <div
    class="message-stranger text-primary bg-gray-100 p-2 mb-2 rounded break-words"
  >
    <p class="message--content text-xs min-[851px]:text-sm">
      <slot></slot>
    </p>
  </div>
</template>

<style scoped>
.message-stranger {
  max-width: 45%;
  grid-column: 1 / span 2;
  justify-self: start;
}

.message-admin {
  color: #191f29;
  background-color: #ffc131;
}

.message-user {
  color: #f9fafb;
  background-color: #313d51;
  justify-self: end;
}
</style>
