const yup = require("yup");

exports.messageSchema = yup.object({
  message: yup
    .string()
    .min(1, "Wiadomość jest zbyt krótka")
    .max(4096, "Wiadomość jest zbyt długa")
    .required("Wiadomość jest wymagana"),
});
