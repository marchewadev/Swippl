const yup = require("yup");
const dayjs = require("dayjs");

exports.createUserSchema = yup.object({
  email: yup
    .string()
    .email("Niepoprawny adres e-mail")
    .min(3, "Adres e-mail jest zbyt krótki")
    .max(254, "Adres e-mail jest zbyt długi")
    .required("Adres e-mail jest wymagany"),
  password: yup
    .string()
    .min(8, "Hasło musi mieć co najmniej 8 znaków")
    .required("Hasło jest wymagane"),
  password2: yup
    .string()
    .min(8, "Hasło musi mieć co najmniej 8 znaków")
    .oneOf([yup.ref("password")], "Hasła muszą być takie same")
    .required("Hasło jest wymagane"),
  name: yup
    .string()
    .min(3, "Imię jest zbyt krótkie")
    .max(20, "Imię jest zbyt długie")
    .required("Imię jest wymagane"),
  gender: yup
    .string()
    .oneOf(["female", "male"], "Niepoprawna płeć")
    .required("Płeć jest wymagana"),
  birthdate: yup
    .date()
    .typeError("Data urodzenia musi być prawidłową datą")
    .test(
      "is-18",
      "Musisz mieć co najmniej 18 lat",
      (value) => dayjs().diff(dayjs(value), "years") >= 18
    )
    .test(
      "is-less-than-100",
      "Nie możesz mieć więcej niż 100 lat",
      (value) => dayjs().diff(dayjs(value), "years") < 100
    )
    .required("Data urodzenia jest wymagana"),
  terms: yup
    .boolean()
    .isTrue("Akceptacja regulaminu jest obowiązkowa")
    .required("Akceptacja regulaminu jest obowiązkowa"),
});

exports.loginUserSchema = yup.object({
  email: yup
    .string()
    .email("Niepoprawny adres e-mail")
    .min(3, "Adres e-mail jest zbyt krótki")
    .max(254, "Adres e-mail jest zbyt długi")
    .required("Adres e-mail jest wymagany"),
  password: yup
    .string()
    .min(8, "Hasło musi mieć co najmniej 8 znaków")
    .required("Hasło jest wymagane"),
});

exports.deleteUserSchema = yup.object({
  email: yup
    .string()
    .email("Niepoprawny adres e-mail")
    .min(3, "Adres e-mail jest zbyt krótki")
    .max(254, "Adres e-mail jest zbyt długi")
    .required("Adres e-mail jest wymagany"),
  password: yup
    .string()
    .min(8, "Hasło musi mieć co najmniej 8 znaków")
    .required("Hasło jest wymagane"),
  password2: yup
    .string()
    .min(8, "Hasło musi mieć co najmniej 8 znaków")
    .oneOf([yup.ref("password")], "Hasła muszą być takie same")
    .required("Hasło jest wymagane"),
});

exports.updateUserProfileSchema = yup.object({
  name: yup
    .string()
    .optional()
    .min(3, "Imię jest zbyt krótkie")
    .max(20, "Imię jest zbyt długie"),
  city: yup
    .string()
    .trim()
    .max(30, "Nazwa miejscowości jest zbyt długa")
    .optional(),
  birthdate: yup
    .date()
    .typeError("Data urodzenia musi być prawidłową datą")
    .test("is-18", "Musisz mieć co najmniej 18 lat", (value) => {
      if (!value) return true;
      return dayjs().diff(dayjs(value), "years") >= 18;
    })
    .test("is-less-than-100", "Nie możesz mieć więcej niż 100 lat", (value) => {
      if (!value) return true;
      return dayjs().diff(dayjs(value), "years") < 100;
    }),
});

exports.updateUserEmailSchema = yup.object({
  email: yup
    .string()
    .required("Adres e-mail jest wymagany")
    .email("Niepoprawny adres e-mail")
    .min(3, "Adres e-mail jest zbyt krótki")
    .max(254, "Adres e-mail jest zbyt długi"),
  email2: yup
    .string()
    .required("Adres e-mail jest wymagany")
    .email("Niepoprawny adres e-mail")
    .min(3, "Adres e-mail jest zbyt krótki")
    .max(254, "Adres e-mail jest zbyt długi")
    .oneOf([yup.ref("email")], "Adresy e-mail muszą być takie same"),
  password: yup
    .string()
    .required("Hasło jest wymagane")
    .min(8, "Hasło musi mieć co najmniej 8 znaków"),
});

exports.updateUserPasswordSchema = yup.object({
  oldPassword: yup
    .string()
    .required("Hasło jest wymagane")
    .min(8, "Hasło musi mieć co najmniej 8 znaków"),
  newPassword: yup
    .string()
    .required("Hasło jest wymagane")
    .min(8, "Hasło musi mieć co najmniej 8 znaków"),
  newPassword2: yup
    .string()
    .required("Hasło jest wymagane")
    .min(8, "Hasło musi mieć co najmniej 8 znaków")
    .oneOf([yup.ref("newPassword")], "Hasła muszą być takie same"),
});
