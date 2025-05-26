require('dotenv').config();
const transporter = require('../../configs/mailer.config');
const fs = require('fs');
const path = require('path');
const sendEmailOTP = async (email, otp) => {
  try {
    const htmlTemplatePath = path.join(
      __dirname,
      '../../templates/mailTemplate.html'
    );
    const htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf8');
    const htmlContent = htmlTemplate.replace('{{OTP}}', otp);
    const mailOptions = {
      from: process.env.MAILER_USER,
      to: email,
      subject: 'Your OTP Code',
      html: htmlContent,
    };
    const result = await transporter.sendMail(mailOptions);

    return result;
  } catch (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
const sendNewPasswordEmail = async (email, newPassword) => {
  try {
    const htmlTemplatePath = path.join(
      __dirname,
      '../../templates/mailForgotPassword.html'
    );
    const htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf8');
    const htmlContent = htmlTemplate.replace('{{NEW_PASSWORD}}', newPassword);
    const mailOptions = {
      from: process.env.MAILER_USER,
      to: email,
      subject: 'Your New Password',
      html: htmlContent,
    };
    const result = await transporter.sendMail(mailOptions);

    return result;
  } catch (error) {
    throw new Error('cretae');
  }
};
const sendBanAccountEmail = async (email) => {
  try {
    const htmlTemplatePath = path.join(
      __dirname,
      '../../templates/mailBanAccount.html'
    );
    const htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf8');
    const htmlContent = htmlTemplate.replace('{{EMAIL}}', email);
    const mailOptions = {
      from: process.env.MAILER_USER,
      to: email,
      subject: 'Your Account Has Been Banned',
      html: htmlContent,
    };
    const result = await transporter.sendMail(mailOptions);

    return result;
  } catch (error) {
    throw new Error('create');
  }
};
const sendBillPaymentEmail = async (email, amount, content, code, time) => {
  // console.log('Sending bill payment email to:', email);
  // console.log('Amount:', amount);
  // console.log('Content:', content);
  // console.log('Code:', code);
  // console.log('Time:', time);
  try {
    const htmlTemplatePath = path.join(
      __dirname,
      '../../templates/mailBillPayment.html'
    );
    const htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf8');
    const htmlContent = htmlTemplate
      .replace('{{AMOUNT}}', amount)
      .replace('{{CONTENT}}', content)
      .replace('{{CODE}}', code)
      .replace('{{TIME}}', time);
    const mailOptions = {
      from: process.env.MAILER_USER,
      to: email,
      subject: 'Your Bill Payment Details',
      html: htmlContent,
    };
    const result = await transporter.sendMail(mailOptions);

    return result;
  } catch (error) {
    throw new Error('create');
  }
};
module.exports = {
  sendEmailOTP,
  sendNewPasswordEmail,
  sendBanAccountEmail,
  sendBillPaymentEmail,
};
