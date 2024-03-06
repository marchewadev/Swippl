<template>
  <form id="profileForm" class="form-container py-5" @submit="onSubmit">
    <div class="mb-4">
      <div class="avatar-container relative">
        <img
          :src="previewAvatar || setAvatarFn"
          alt="User's avatar"
          class="h-56 aspect-square min-[1330px]:h-64 min-[1600px]:h-72"
        />
        <button
          class="bg-gray-100/50 p-2 rounded-md hover:text-red-600 active:text-red-600 transition-colors duration-300 absolute left-99 bottom-99 -translate-x-full translate-y-full flex"
          type="button"
          @click="markAvatarForDeletion"
        >
          <ion-icon
            name="trash-outline"
            class="avatar--delete-icon text-2xl"
          ></ion-icon>
        </button>
      </div>
      <field
        name="avatar"
        type="file"
        accept=".png, .jpg, .jpeg"
        class="text-xs max-w-[15rem]"
        @change="previewImage"
      ></field>
      <error-message
        name="avatar"
        as="p"
        class="text-xs mt-1 text-red-600"
      ></error-message>
    </div>
    <div class="mb-4">
      <label-field :label-for="'name'">Jak się nazywasz?</label-field>
      <input-text
        name="name"
        :placeholder="'Janek'"
        :input-props="{ minlength: 3, maxlength: 21 }"
        :input-id="'name'"
      ></input-text>
    </div>
    <div class="mb-4">
      <label-field :label-for="'city'">Miejscowość</label-field>
      <input-text
        name="city"
        :placeholder="'Warszawa'"
        :input-props="{ maxlength: 31 }"
        :input-id="'city'"
      ></input-text>
    </div>
    <div class="mb-4">
      <label-field :label-for="'birthdate'">Data urodzenia</label-field>
      <input-text
        type="date"
        name="birthdate"
        :input-id="'birthdate'"
      ></input-text>
    </div>
    <form-button
      :form-id="'profileForm'"
      :button-title="'Zapisz'"
      class="w-full"
    ></form-button>
  </form>
</template>

<script setup>
import { ref, watch } from "vue";
import { useForm, Field, ErrorMessage } from "vee-validate";
import { object, string, date, mixed } from "yup";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/UserStore";
import { setAvatar } from "@/utils/setAvatar";
import dayjs from "dayjs";
import InputText from "@/components/form/InputText.vue";
import LabelField from "@/components/form/LabelField.vue";
import FormButton from "@/components/buttons/FormButton.vue";
import defaultAvatar from "@/assets/images/avatar.png";

const userStore = useUserStore();

const { deleteUserAvatar } = userStore;
const { userAvatar } = storeToRefs(userStore);

const avatarToDelete = ref(false);
const previewAvatar = ref(null);

const { handleSubmit } = useForm({
  validationSchema: object({
    avatar: mixed()
      .optional()
      .test(
        "fileFormat",
        "* Nieobsługiwany format",
        (value) =>
          !value ||
          ["image/jpg", "image/jpeg", "image/png"].includes(value.type)
      )
      .test(
        "fileSize",
        "* Plik jest za duży",
        (value) => !value || value.size <= 1024 * 1024 * 2 // 2MB
      ),
    name: string()
      .trim()
      .required("Imię jest wymagane")
      .min(3, "Imię jest zbyt krótkie")
      .max(20, "Imię jest zbyt długie"),
    city: string()
      .trim()
      .optional()
      .max(30, "Nazwa miejscowości jest zbyt długa"),
    birthdate: date()
      .typeError("Data urodzenia musi być prawidłową datą")
      .test("is-18", "Musisz mieć co najmniej 18 lat", (value) => {
        if (!value) return true;
        return dayjs().diff(dayjs(value), "years") >= 18;
      })
      .test(
        "is-less-than-100",
        "Nie możesz mieć więcej niż 100 lat",
        (value) => {
          if (!value) return true;
          return dayjs().diff(dayjs(value), "years") < 100;
        }
      ),
  }),
  initialValues: {
    name: userStore.user.name,
    city: userStore.user.city,
    birthdate: userStore.user.birthdate,
  },
});

watch(userAvatar, () => {
  previewAvatar.value = null;
});

const onSubmit = handleSubmit((values) => {
  if (avatarToDelete.value) {
    values.avatarToDelete = avatarToDelete.value;
  }

  userStore.updateUserProfile(values);
  avatarToDelete.value = false;
});

const setAvatarFn = setAvatar(userAvatar, defaultAvatar);

const previewImage = (event) => {
  const file = event.target.files[0];
  if (file) {
    previewAvatar.value = URL.createObjectURL(file);
  }
};

const markAvatarForDeletion = () => {
  avatarToDelete.value = true;
  deleteUserAvatar();
};
</script>
