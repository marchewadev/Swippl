<template>
  <form @submit="onSubmit" id="profileForm" class="form-container">
    <div class="mb-4">
      <div class="avatar-container relative">
        <img src="@/assets/avatar.png" alt="User's avatar" class="h-72" />
        <button
          class="bg-gray-100/50 hover:text-red-700 p-2 rounded-md transition-colors duration-300 absolute left-99 bottom-99 -translate-x-full translate-y-full flex"
          type="button"
        >
          <ion-icon
            name="trash-outline"
            class="avatar--delete-icon text-2xl"
          ></ion-icon>
        </button>
      </div>
      <Field
        name="field"
        type="file"
        accept=".png, .jpg, .jpeg"
        class="text-xs"
      />
      <ErrorMessage name="field" as="p" />
    </div>
    <div class="mb-4">
      <label for="" class="block text-base mb-1">Jak się nazywasz?</label>
      <InputText name="name" :placeholder="'Janek'" />
    </div>
    <div class="mb-4">
      <label for="" class="block text-base mb-1">Miejscowość</label>
      <InputText name="city" :placeholder="'Warszawa'" />
    </div>
    <div class="mb-4">
      <label for="" class="block text-base mb-1">Data urodzenia</label>
      <InputText type="date" name="birthday" />
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
import dayjs from "dayjs";
import InputText from "@/components/form/InputText.vue";
import FormButton from "@/components/settings/FormButton.vue";

const { handleSubmit } = useForm({
  validationSchema: object({
    field: mixed()
      .optional()
      .test("fileSelected", "", (value) => value !== undefined)
      .test(
        "fileSize",
        "Plik jest za duży",
        (value) => value && value.size <= 1024 * 1024 * 2 // 2MB
      )
      .test(
        "fileFormat",
        "Nieobsługiwany format",
        (value) =>
          value && ["image/jpg", "image/jpeg", "image/png"].includes(value.type)
      ),
    name: string()
      .required("Imię jest wymagane")
      .trim()
      .min(1, "Imię musi składać się z minimum 1 znaku")
      .max(25, "Imię może składać się z maksymalnie 25 znaków"),
    city: string()
      .optional()
      .trim()
      .max(30, "Miejscowość może składać się z maksymalnie 30 znaków"),
    birthday: date()
      .required("Data urodzenia jest wymagana")
      .test(
        "is-18",
        "Musisz mieć co najmniej 18 lat",
        (value) => dayjs().diff(dayjs(value), "years") >= 18
      )
      .test(
        "is-less-than-100",
        "Nie możesz mieć więcej niż 100 lat",
        (value) => dayjs().diff(dayjs(value), "years") < 100
      ),
  }),
});

const onSubmit = handleSubmit((values) => {
  console.log(JSON.stringify(values));
});
</script>
