const Account = require('../models/account');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const { verifyOtpService } = require('./otpService');
const { sendValidationError } = require('../helpers/apiHelper');
const { uuid } = require('uuidv4');
const client = require('../configs/twilioConnect');
require('dotenv').config();
// TODO: LoginService
const loginService = async (phoneNumber, password, res) => {
  const account = await Account.findOne({
    phoneNumber,
  });
  if (!account) {
    throw new Error('Số điện thoại hoặc mật khẩu không đúng');
  }
  const passwordMatch = await bcrypt.compare(password, account.password);
  if (!passwordMatch) {
    throw new Error('Số điện thoại hoặc mật khẩu không đúng');
  }
  const payload = {
    _id: account._id,
    phoneNumber: account.phoneNumber,
  };
  const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const refresh_token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
  res.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    sameSite: 'strict',
  });
  return {
    access_token,
    result: {
      fullName: account.fullName,
      phoneNumber: account.phoneNumber,
      avatar: account.avatar,
      role: account.role,
      isBanned: account.isBanned,
      address: account.address,
      followers: account.followers,
      following: account.following,
    },
  };
};
//TODO RegisterService
const registerService = async (phoneNumber, password, res) => {
  const fullName = `Hunter${dayjs().format('DDMMYYYYHHmm')}`;
  console.log(fullName);
  const bycryptPassword = await bcrypt.hash(password, 10);
  const account = await Account.create({
    fullName,
    password: bycryptPassword,
    phoneNumber,
    isBanned: false,
    address: '',
    avatar: '',
    followers: [],
    following: [],
  });
  if (!account) {
    throw new Error('Đăng ký không thành công');
  }
  return {
    phoneNumber: account.phoneNumber,
  };
  // register logic
};
//TODO: ForgotPasswordService
const forgotPasswordService = async (phoneNumber, otp) => {
  const phoneVn = `+84${phoneNumber.slice(1)}`;
  const very = await verifyOtpService(phoneVn, otp);
  if (!very) {
    throw new Error('OTP is incorrect');
  }
  const newPass = uuid().slice(0, 8);
  const hashPass = await bcrypt.hash(newPass, 10);

  const message = `Mật khẩu mới của bạn là ${newPass}`;
  const result = await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneVn,
    body: message,
  });
  if (!result) {
    throw new Error('OTP sent failed');
  }
  console.log(newPass);
  const changePass = await Account.findOneAndUpdate(
    { phoneNumber },
    { password: hashPass }
  );
  if (!changePass) {
    throw new Error('OTP sent failed');
  }
  return true;
};
module.exports = {
  loginService,
  registerService,
  forgotPasswordService,
};
