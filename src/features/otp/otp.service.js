const bcrypt = require('bcrypt');
const { Otp } = require('../../models');
const { twilioConfig } = require('../../configs');
require('dotenv').config();

const sendOtp = async (phoneNumber) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const bycryptOtp = await bcrypt.hash(otp.toString(), 10);
    const result = await twilioConfig.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+84${phoneNumber.slice(1)}`,
      body: `Your OTP is ${otp}`,
    });
    if (!result) throw new Error('create');
    const resultOtp = await Otp.create({ phoneNumber, otp: bycryptOtp });
    if (!resultOtp) throw new Error('create');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const verifyOtp = async (data) => {
  try {
    const phone = await Otp.findOne({
      phoneNumber: data.phoneNumber,
    }).sort({ createAt: -1 });
    if (!phone) throw new Error('notfound');
    const check = await bcrypt.compare(data.otp, phone.otp);
    if (!check) throw new Error('incorrect');
    const otpDelete = await Otp.delete({
      phoneNumber: data.phoneNumber,
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
