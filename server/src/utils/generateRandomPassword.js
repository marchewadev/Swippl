const crypto = require("crypto");

function generateRandomPassword(length) {
  // This function generates a random password of the specified length.
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let password = "";

  for (let i = 0; i < length; i++) {
    password += chars[crypto.randomBytes(1)[0] % chars.length];
  }

  return password;
}

module.exports = generateRandomPassword;
