const bcrypt = require('bcrypt');
const { Otp } = require('../../models');
const { twilioConfig } = require('../../configs');
require('dotenv').config();

const sendOtp = async (phoneNumber) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const bycryptOtp = await bcrypt.hash(otp.toString(), 10);
  const result = await twilioConfig.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to: `+84${phoneNumber.slice(1)}`,
    body: `Your OTP is ${otp}`,
  });
  if (!result) throw new Error('OTP sent failed');
  const resultOtp = await Otp.create({ phoneNumber, otp: bycryptOtp });
  if (!resultOtp) throw new Error('OTP sent failed');
  return result;
};
const verifyOtp = async (data) => {
  const phone = await Otp.findOne({
    phoneNumber: data.phoneNumber,
  }).sort({ createAt: -1 });
  if (!phone) throw new Error('OTP is incorrect');
  const compare = await bcrypt.compare(data.otp, phone.otp);
  if (!compare) throw new Error('OTP is incorrect');
  const otpDelete = await Otp.delete({
    phoneNumber: data.phoneNumber,
  });

  return true;
};
module.exports = {
  sendOtp,
  verifyOtp,
};
