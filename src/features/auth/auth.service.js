const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const { uuid } = require('uuidv4');
const { Account, Role } = require('../../models');
const { twilioConfig } = require('../../configs');
require('dotenv').config();
const otpService = require('../otp/otp.service');
const { uploadSingle } = require('../file/file.service');
const isPhoneNumber = (input) => {
  return /^[0-9]{9,15}$/.test(input);
};
const login = async (data, res) => {
  const query = isPhoneNumber(data.phoneOrUsername)
    ? { phoneNumber: data.phoneOrUsername }
    : { username: data.phoneOrUsername };
  const account = await Account.findOne(query)
    .select('-__v -createdAt -updatedAt')
    .populate({
      path: 'role address.provinceId address.districtId address.wardId',
      select: 'name _id permissions',
    })
    .lean();
  if (!account || !account.isBanned)
    throw new Error(
      account ? 'Your account has been banned' : 'The login infor is incorrect.'
    );

  if (
    (account?.role === null && data.type === 'ADMIN') ||
    (account?.role !== null && data.type === 'USER')
  )
    throw new Error('The login infor is incorrect.');

  const passwordMatch = await bcrypt.compare(data.password, account.password);
  if (!passwordMatch) throw new Error('The login infor is incorrect.');

  if (!account.isBanned) throw new Error('Your account has been banned');

  const payload = {
    _id: account._id,
    phoneNumber: account.phoneNumber,
    username: account.username,
    role: account.role,
  };
  const [access_token, refresh_token] = await Promise.all([
    jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }),
    jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    }),
  ]);
  res.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });
  const { password: _, ...safeAccount } = account;
  return { access_token, ...safeAccount };
};

const register = async (data) => {
  const fullName = `Hunter${dayjs().format('DDMMYYYYHHmm')}`;
  const bycryptPassword = await bcrypt.hash(data.password, 10);

  const account = await Account.create({
    name: fullName,
    password: bycryptPassword,
    phoneNumber: data.phoneNumber,
    username: data.username,
  });
  if (!account) throw new Error('Register failed');
  return account;
};

const forgotPassword = async (data) => {
  const very = await otpService.verifyOtp(data);
  if (!very) throw new Error('OTP is incorrect');
  const newPass = uuid().slice(0, 8);
  const hashPass = await bcrypt.hash(newPass, 10);
  const result = await twilioConfig.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to: `+84${data.phoneNumber.slice(1)}`,
    body: `Your new password is ${newPass}`,
  });
  if (!result) throw new Error('OTP sent failed');
  const changePass = await Account.findOneAndUpdate(
    { phoneNumber: data.phoneNumber },
    { password: hashPass }
  );
  if (!changePass) throw new Error('OTP sent failed');
  return true;
};

const getAccountInfo = async (data) => {
  const account = await Account.findOne({ _id: data._id })
    .select('-__v -createdAt -updatedAt -password -deleted')
    .populate({
      path: 'role address.provinceId address.districtId address.wardId',
      select: 'name _id permissions',
    })
    .lean();
  return account;
};

const getNewAccessToken = async (data) => {
  const account = await Account.findOne({ _id: data._id })
    .select('-__v -createdAt -updatedAt -password -deleted')
    .populate({
      path: 'role address.provinceId address.districtId address.wardId',
      select: 'name _id permissions',
    })
    .lean();
  if (!account) throw new Error('User not found');
  const payload = {
    _id: account._id,
    phoneNumber: account.phoneNumber,
    username: account.username,
    role: account.role,
  };
  const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return { access_token };
};
const changePassword = async (id, data) => {
  const hashNewPassword = await bcrypt.hash(data.newPassword, 10);
  const account = await Account.findById(id).exec();
  if (!account) throw new Error('Account not found');
  const passwordMatch = await bcrypt.compare(
    data.currentPassword,
    account.password
  );
  if (!passwordMatch) throw new Error('Current password is incorrect');
  const result = await Account.findByIdAndUpdate(id, {
    password: hashNewPassword,
  }).exec();
  if (!result) throw new Error('Change password failed');
  return result;
};
const updateProfile = async (id, data) => {
  const avatarUrl = data.avatar ? await uploadSingle(data.avatar) : null;
  const result = await Account.findByIdAndUpdate(
    id,
    {
      ...data,
      ...(avatarUrl && { avatar: avatarUrl }),
      address: data.address ? JSON.parse(data.address) : null,
    },
    {
      new: true,
    }
  )
    .select('-password -__v -createdAt -updatedAt -deleted')
    .populate(
      'role address.provinceId address.districtId address.wardId',
      'name _id permissions'
    )
    .lean()
    .exec();
  if (!result) throw new Error('Update profile failed');
  return result;
};
module.exports = {
  login,
  register,
  forgotPassword,
  getAccountInfo,
  getNewAccessToken,
  changePassword,
  updateProfile,
};
