const nodemailer = require('nodemailer');
require('dotenv').config();
const transportOptions = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAILER_USER, // your email address
    pass: process.env.MAILER_PASSWORD, // your email password
  },  
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
};  
const transporter = nodemailer.createTransport(transportOptions);

module.exports = transporter;