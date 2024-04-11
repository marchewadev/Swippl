import { MessageType } from "@/types/chat";
import { StrangerData } from "@/interfaces/user";

interface Message {
  content: string;
  type: MessageType;
}

export interface ChatState {
  totalUsers: number;
  roomUsers: number;
  isSearching: boolean;
  sessionID: string | null;
  privateSessionID: number | null;
  activeFriendID: number | null;
  page: number;
  areMessagesLoaded: boolean;
  areMessagesLoading: boolean;
  hasMoreMessages: boolean;
  messages: Message[];
}

export interface ChatObject {
  userID: number;
  friendID: number;
  sessionID: number;
  page?: number;
}

export interface ChatHistoryObject {
  chatHistory: Message[];
  friendObject: StrangerData;
  hasMoreMessages: boolean;
  friendStatus: string;
}

export interface LoadOldMessages {
  loadMoreMessagesFn: Function;
  options: {
    direction: "top";
    interval: number;
    distance: number;
    canLoadMore: () => boolean;
  };
}
