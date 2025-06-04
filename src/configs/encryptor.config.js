
const CryptoJS = require("crypto-js");
require("dotenv").config();

const SECRET_KEY = process.env.AES_SECRET_KEY;

// Mã hóa tin nhắn
const encryptMessage = (plainText) => {
  return CryptoJS.AES.encrypt(plainText, SECRET_KEY).toString();
};

// Giải mã tin nhắn
const decryptMessage = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = {
  encryptMessage,
  decryptMessage,
};
