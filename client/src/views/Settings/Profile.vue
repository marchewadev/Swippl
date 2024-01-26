<template>
  <form @submit="onSubmit" id="profileForm" class="form-container">
    <div class="mb-4">
      <div class="avatar-container relative">
        <img src="@/assets/avatar.png" alt="User's avatar" class="h-72" />
        <button
          class="bg-gray-100/50 hover:text-red-600 p-2 rounded-md transition-colors duration-300 absolute left-99 bottom-99 -translate-x-full translate-y-full flex"
          type="button"
        >
          <ion-icon
            name="trash-outline"
            class="avatar--delete-icon text-2xl"
          ></ion-icon>
        </button>
      </div>
      <Field
        name="avatar"
        type="file"
        accept=".png, .jpg, .jpeg"
        class="text-xs max-w-[15rem]"
      />
      <ErrorMessage name="avatar" as="p" class="text-xs mt-1 text-red-600" />
    </div>
    <div class="mb-4">
      <label for="" class="block text-base mb-1">Jak się nazywasz?</label>
      <InputText
        name="name"
        :placeholder="'Janek'"
        :inputProps="{ minlength: 3, maxlength: 21 }"
      />
    </div>
    <div class="mb-4">
      <label for="" class="block text-base mb-1">Miejscowość</label>
      <InputText
        name="city"
        :placeholder="'Warszawa'"
        :inputProps="{ maxlength: 31 }"
      />
    </div>
    <div class="mb-4">
      <label for="" class="block text-base mb-1">Data urodzenia</label>
      <InputText type="date" name="birthdate" />
    </div>
    <FormButton
      :formId="'profileForm'"
      :buttonTitle="'Zapisz'"
      class="w-full"
    />
  </form>
</template>

<script setup>
import { useForm, Field, ErrorMessage } from "vee-validate";
import { object, string, date, mixed } from "yup";
import { useUserStore } from "@/stores/UserStore";
import dayjs from "dayjs";
import InputText from "@/components/form/InputText.vue";
import FormButton from "@/components/settings/FormButton.vue";

const userStore = useUserStore();

const { handleSubmit } = useForm({
  validationSchema: object({
    // avatar: mixed()
    //   .optional()
    //   .test("fileSelected", "", (value) => value !== undefined)
    //   .test(
    //     "fileFormat",
    //     "* Nieobsługiwany format",
    //     (value) =>
    //       value && ["image/jpg", "image/jpeg", "image/png"].includes(value.type)
    //   )
    //   .test(
    //     "fileSize",
    //     "* Plik jest za duży",
    //     (value) => value && value.size <= 1024 * 1024 * 2 // 2MB
    //   ),
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

const onSubmit = handleSubmit((values) => {
  userStore.updateUserProfile(values);
});
</script>
