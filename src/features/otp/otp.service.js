const bcrypt = require('bcrypt');
const { Otp } = require('../../models');
require('dotenv').config();
const emailService = require('../email/email.service');
const sendOtp = async (email) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const bycryptOtp = await bcrypt.hash(otp.toString(), 10);
  
    const result = await emailService.sendEmailOTP(email, otp);
    if (!result) throw new Error('create');
    const resultOtp = await Otp.create({ email, otp: bycryptOtp });
    if (!resultOtp) throw new Error('create');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const verifyOtp = async (data) => {
  try {
    const mail = await Otp.findOne({
      email: data.email,
    }).sort({ createAt: -1 });
    if (!mail) throw new Error('notfound');
    const check = await bcrypt.compare(data.otp, mail.otp);
    if (!check) throw new Error('incorrect');
    const otpDelete = await Otp.delete({
      email: data.email,
    });
    if (!otpDelete) throw new Error('delete');

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  sendOtp,
  verifyOtp,
};
