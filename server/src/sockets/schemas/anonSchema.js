const yup = require("yup");

exports.anonDataSchema = yup.object({
  age: yup
    .number()
    .integer()
    .min(18, "Musisz mieć co najmniej 18 lat")
    .max(100, "Nie możesz mieć więcej niż 100 lat")
    .required("Wiek jest wymagany"),
  gender: yup
    .string()
    .oneOf(["female", "male"], "Niepoprawna płeć")
    .required("Płeć jest wymagana"),
  searchCriteria: yup
    .object({
      age: yup
        .array()
        .of(yup.number().integer().min(18).max(100))
        .min(2)
        .max(2)
        .test("is-valid-range", "Nieprawidłowy zakres wieku", (value) => {
          if (!value) return true;
          return value[0] <= value[1];
        })
        .required("Zakres wieku jest wymagany"),
      gender: yup
        .string()
        .oneOf(["any", "male", "female"], "Niepoprawna płeć")
        .required("Płeć jest wymagana"),
    })
    .required("Kryteria wyszukiwania są wymagane"),
});
