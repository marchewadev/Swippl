const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = (to, name, password) => {
  return {
    to,
    from: process.env.SENDGRID_SENDER,
    subject: "Resetowanie hasła w Swippl",
    html: `
    <strong>Witaj, ${name}!</strong>
    <p>Oto Twoje nowe hasło: ${password}</p>
    `,
  };
};

const sendMail = async (to, name, password) => {
  try {
    await sgMail.send(msg(to, name, password));
  } catch (err) {
    throw new Error("Wystąpił błąd podczas wysyłania maila");
  }
};

module.exports = sendMail;
