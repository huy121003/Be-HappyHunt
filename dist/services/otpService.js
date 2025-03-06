const client = require('../configs/twilioConnect');
const bcrypt = require('bcrypt');
const Otp = require('../models/otp');
require('dotenv').config();
const sendOtpService = async phoneNumber => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const bycryptOtp = await bcrypt.hash(otp.toString(), 10);
  const message = `Your OTP is ${otp}`;
  const result = await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber,
    body: message
  });
  if (!result) {
    throw new Error('OTP sent failed');
  }
  const resultOtp = await Otp.create({
    phoneNumber,
    otp: bycryptOtp
  });
  if (!resultOtp) {
    throw new Error('OTP sent failed');
  }
  return result;
};
const verifyOtpService = async (phoneNumber, otp) => {
  const phone = await Otp.findOne({
    phoneNumber
  }).sort({
    createAt: -1
  });
  if (!phone) {
    throw new Error('OTP is incorrect');
  }
  const compare = await bcrypt.compare(otp, phone.otp);
  if (!compare) {
    throw new Error('OTP is incorrect');
  }
  const otpDelete = await Otp.delete({
    phoneNumber
  });
  if (!otpDelete) {
    throw new Error('OTP is incorrect');
  }
  return otp;
};
module.exports = {
  sendOtpService,
  verifyOtpService
};