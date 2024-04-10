import { Ref } from "vue";
import { computed } from "vue";

export function setAvatar(
  getAvatar: Ref<string | null>,
  defaultAvatar: string
) {
  return computed(() => getAvatar.value || defaultAvatar);
}
