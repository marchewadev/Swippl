import { Ref } from "vue";
import { GenderSearch } from "@/types/user";

interface BaseProfileData {
  name: string;
  gender: string;
  city: string;
  avatar: string;
}

interface Friend {
  id: number;
  avatar: string;
  name: string;
  sessionID: number;
  latestMessage: {
    message_content: string;
  };
}

export interface AnonData {
  gender: string;
  birthdate: string;
}

export interface UserData extends BaseProfileData {
  id: number | null;
  birthdate: string;
}

export interface StrangerData extends BaseProfileData {
  age: number;
}

export interface UserState {
  user: UserData;
  token: Ref<string | null>;
  friends: Friend[];
  searchCriteria: Ref<{
    ageRangeSearch: [number, number];
    genderSearch: GenderSearch;
  }>;
  areCriteriaArbitrary: boolean;
}

export interface StrangerState {
  stranger: StrangerData;
  showProfile: boolean;
  friendRequest: boolean;
  friendStatus: string | null;
}
