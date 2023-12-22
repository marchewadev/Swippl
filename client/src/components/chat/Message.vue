<template>
  <div class="message p-2 mb-2 rounded break-words text-primary bg-gray-100">
    <p class="message--content text-sm">
      <slot></slot>
    </p>
  </div>
</template>

<script setup></script>

<style scoped>
.message {
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
