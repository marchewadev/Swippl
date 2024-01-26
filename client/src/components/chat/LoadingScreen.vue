<template>
  <div class="flex flex-col items-center justify-center h-full gap-4">
    <div class="flex gap-2">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
    <p class="text-sm">Szukanie rozmówcy</p>
  </div>
</template>

<style scoped>
.dot {
  display: inline-block;
  width: 10px;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: #ffc131;
}

.dot:nth-last-child(1) {
  animation: fallingAnimation 1s 0.3s linear infinite;
}
.dot:nth-last-child(2) {
  animation: fallingAnimation 1s 0.2s linear infinite;
}
.dot:nth-last-child(3) {
  animation: fallingAnimation 1s 0.1s linear infinite;
}

@keyframes fallingAnimation {
  0% {
    transform: translate(0, -15px);
    opacity: 0;
  }
  25%,
  50%,
  75% {
    transform: translate(0, 0);
    opacity: 1;
  }
  100% {
    transform: translate(0, 15px);
    opacity: 0;
  }
}
</style>
