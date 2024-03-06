import { computed } from "vue";

export function setAvatar(getAvatar, defaultAvatar) {
  return computed(() => getAvatar.value || defaultAvatar);
}
