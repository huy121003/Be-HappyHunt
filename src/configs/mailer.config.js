const nodemailer = require('nodemailer');
require('dotenv').config();
// const transportOptions = {
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: false, // true for port 465, false for 587
//   auth: {
//     user: process.env.MAILER_USER,
//     pass: process.env.MAILER_PASSWORD,
//   },
// };
 const transportOptions = {
  service: 'gmail', // Use Gmail as the email service
  auth: {
     user: process.env.MAILER_USER,
     pass: process.env.MAILER_PASSWORD,
   },
 };
const transporter = nodemailer.createTransport(transportOptions);

module.exports = transporter;