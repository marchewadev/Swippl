import { Ref } from "vue";

interface BaseProfileData {
  name: string;
  gender: string;
  city: string;
  avatar: string;
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
  friends: [];
  searchCriteria: Ref<{
    ageRangeSearch: [number, number];
    genderSearch: string;
  }>;
  areCriteriaArbitrary: boolean;
}

export interface StrangerState {
  stranger: StrangerData;
  showProfile: boolean;
  friendRequest: boolean;
  friendStatus: string | null;
}
