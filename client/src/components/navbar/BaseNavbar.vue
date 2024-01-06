<template>
  <nav>
    <slot name="additional"></slot>
    <ul class="flex items-center gap-1 group-[.is-settings]:gap-2">
      <slot name="links"></slot>
    </ul>
  </nav>
</template>

<script setup></script>
