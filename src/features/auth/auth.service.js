const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

const { uuid } = require('uuidv4');
const { Account, Role } = require('../../models');
const { twilioConfig } = require('../../configs');
require('dotenv').config();
const otpService = require('../otp/otp.service');
// TODO: LoginService

const login = async (phoneNumber, password, res) => {
  const account = await Account.findOne({ phoneNumber })
    .populate('role')
    .lean();
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

  // Loại bỏ password trước khi trả về
  delete account.password;

  return {
    access_token,
    result: account,
  };
};

//TODO RegisterService
const register = async (phoneNumber, password, res) => {
  const fullName = `Hunter${dayjs().format('DDMMYYYYHHmm')}`;
  console.log(fullName);
  const bycryptPassword = await bcrypt.hash(password, 10);
  const role = await Role.findOne({ name: 'Normal User' });
  if (!role) {
    throw new Error('Role not found');
  }
  const account = await Account.create({
    fullName,
    password: bycryptPassword,
    phoneNumber,
    isBanned: false,
    address: '',
    avatar: '',
    role: role._id,
    isVip: false,
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
const forgotPassword = async (phoneNumber, otp) => {
  const phoneVn = `+84${phoneNumber.slice(1)}`;
  const very = await otpService.verifyOtp(phoneVn, otp);
  if (!very) {
    throw new Error('OTP is incorrect');
  }
  const newPass = uuid().slice(0, 8);
  const hashPass = await bcrypt.hash(newPass, 10);

  const message = `Mật khẩu mới của bạn là ${newPass}`;
  const result = await twilioConfig.messages.create({
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
//TODO GetUserInfo
const getAccountInfo = async (phoneNumber, _id) => {
  const account = await Account.findOne({ _id })
    .select('-password')
    .populate('role')
    .lean();
  if (!account) {
    throw new Error('User not found');
  }
  return account;
};
//TODO GetNewAccessToken
const getNewAccessToken = async (_id, phoneNumber) => {
  const account = await Account.findOne({ _id });
  if (!account) {
    throw new Error('User not found');
  }
  const payload = {
    _id: account._id,
    phoneNumber: account.phoneNumber,
  };
  const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return { access_token };
};

module.exports = {
  login,
  register,
  forgotPassword,
  getAccountInfo,
  getNewAccessToken,
};
