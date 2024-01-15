const yup = require("yup");
const dayjs = require("dayjs");

exports.createAdminSchema = yup.object({
  userId: yup
    .number()
    .min(1, "ID użytkownika musi być większe od 0")
    .required("Id użytkownika jest wymagane"),
});

exports.banUserSchema = yup.object({
  userId: yup
    .number()
    .min(1, "ID użytkownika musi być większe od 0")
    .required("Id użytkownika jest wymagane"),
  reason: yup
    .string()
    .min(1, "Powód nadania bana jest zbyt krótki")
    .max(250, "Powód nadania bana jest zbyt długi")
    .required("Powód nadania bana jest wymagany"),
  banUntil: yup
    .date()
    .typeError("Data musi być prawidłową datą")
    .min(
      dayjs().add(1, "day").toDate(),
      "Data nie może być wcześniejsza niż dzień jutrzejszy"
    )
    .required("Data jest wymagana"),
});
