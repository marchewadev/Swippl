import { useChatStore } from "@/stores/ChatStore";

export const setActiveFriend = (id: number) => {
  const chatStore = useChatStore();
  chatStore.activeFriendID = id;
};
