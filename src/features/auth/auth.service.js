const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const { uuid } = require('uuidv4');
const { Account, Role } = require('../../models');
const { twilioConfig } = require('../../configs');
require('dotenv').config();
const otpService = require('../otp/otp.service');
const { uploadSingle } = require('../file/file.service');
const emailService = require('../email/email.service');
const {
  create: createNotification,
} = require('../notification/notification.soket');
const { socketStore } = require('../app/app.socket');
const isEmail = (input) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
};
const login = async (data, res) => {
  try {
    const query = isEmail(data.emailOrUsername)
      ? { email: data.emailOrUsername }
      : { username: data.emailOrUsername };
    const account = await Account.findOne(query)
      .select('-__v -createdAt -updatedAt')
      .populate({
        path: 'role address.province address.district address.ward',
        select: 'name _id version permissions',
      })
      .lean();
    if (!account) throw new Error('notfound');
    if (!account.isBanned)
      throw new Error('banned: Your account has been banned');

    if (
      (account?.role === null && data.type === 'ADMIN') ||
      (account?.role !== null && data.type === 'USER')
    )
      throw new Error('notfound');

    const passwordMatch = await bcrypt.compare(data.password, account.password);
    if (!passwordMatch) throw new Error('notfound');

    const payload = {
      _id: account._id,
      email: account.email,
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
  } catch (err) {
    throw new Error(err.message);
  }
};

const register = async (data) => {
  try {
    const fullName = `Hunter${dayjs().format('DDMMYYYYHHmm')}`;
    const bycryptPassword = await bcrypt.hash(data.password, 10);

    const account = await Account.create({
      name: fullName,
      password: bycryptPassword,
      email: data.email,
      username: data.username,
      slug: data.username
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, ''),
    });
    if (!account) throw new Error('create');
    return account;
  } catch (err) {
    throw new Error(err.message);
  }
};

const forgotPassword = async (data) => {
  try {
    const very = await otpService.verifyOtp(data);

    if (!very) throw new Error('validation');
    const newPass = uuid().slice(0, 8);
    const hashPass = await bcrypt.hash(newPass, 10).catch((err) => {
      throw new Error('hash');
    });

    await emailService.sendNewPasswordEmail(data.email, newPass);
    const changePass = await Account.findOneAndUpdate(
      { email: data.email },
      { password: hashPass }
    );
    if (!changePass) throw new Error('update');
    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getAccountInfo = async (data) => {
  try {
    const account = await Account.findOne({ _id: data._id })
      .select('-__v -createdAt -updatedAt -password -deleted')
      .populate({
        path: 'role address.province address.district address.ward',
        select: 'name _id version permissions',
      })
      .lean();
    if (!account) throw new Error('notfound');
    return account;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getNewAccessToken = async (data) => {
  try {
    const account = await Account.findOne({ _id: data._id })
      .select('-__v -createdAt -updatedAt -password -deleted')
      .populate({
        path: 'role address.province address.district address.ward',
        select: 'name _id version permissions',
      })
      .lean();
    if (!account) throw new Error('notfound');
    const payload = {
      _id: account._id,
      email: account.email,
      username: account.username,
      role: account.role,
    };
    const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return { access_token };
  } catch (err) {
    throw new Error(err.message);
  }
};
const changePassword = async (id, data) => {
  try {
    const hashNewPassword = await bcrypt.hash(data.newPassword, 10);
    const account = await Account.findById(id).exec();
    if (!account) throw new Error('notfound');
    const passwordMatch = await bcrypt.compare(
      data.currentPassword,
      account.password
    );
    if (!passwordMatch) throw new Error('validation');
    const result = await Account.findByIdAndUpdate(id, {
      password: hashNewPassword,
    }).exec();
    if (!result) throw new Error('update');
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};
const updateProfile = async (id, data) => {
  try {
    const avatarUrl = data.avatar ? await uploadSingle(data.avatar) : null;
    const backgroundUrl = data.background
      ? await uploadSingle(data.background)
      : null;
    const result = await Account.findByIdAndUpdate(
      id,
      {
        ...data,
        ...(avatarUrl && { avatar: avatarUrl }),
        ...(backgroundUrl && { background: backgroundUrl }),
        address: data.address ? JSON.parse(data.address) : null,
      },
      {
        new: true,
      }
    )
      .select('-password -__v -createdAt -updatedAt -deleted')
      .populate(
        'role address.province address.district address.ward',
        'name _id version permissions'
      )
      .lean()
      .exec();
    if (!result) throw new Error('update');
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};
const activeVip = async (id) => {
  try {
    const result = await Account.findByIdAndUpdate(
      id,
      {
        isVip: true,
        dateVipExpired: new Date(
          dayjs().add(30, 'day').format('YYYY-MM-DD')
        ).toISOString(),
        $inc: {
          balance: -100000,
        },
      },
      {
        new: true,
      }
    )
      .select('isVip dateVipExpired')
      .lean()
      .exec();

    if (!result) throw new Error('Failed to update VIP status');

    await createNotification(socketStore.appNamespace, socketStore.socketOn, {
      target: id,
      type: 'VIP_ACTIVE',
      createdBy: id,
    });

    return result;
  } catch (err) {
    throw new Error(err.message || 'Something went wrong');
  }
};

const cancelVip = async (id) => {
  try {
    const result = await Account.findByIdAndUpdate(
      id,
      { isVip: false, dateVipExpired: null },
      { new: true }
    )
      .select('isVip dateVipExpired')
      .lean()
      .exec();
    if (!result) throw new Error('update');
    await createNotification(socketStore.appNamespace, socketStore.socketOn, {
      target: id,
      type: 'VIP_EXPIRED',
      createdBy: id,
    });

    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};
const getVipStatus = async (id) => {
  try {
    const account = await Account.findById(id)
      .select('isVip dateVipExpired')
      .lean()
      .exec();
    if (!account) throw new Error('notfound');

    return {
      isVip: account.isVip,
      dateVipExpired: account.dateVipExpired,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};
module.exports = {
  login,
  register,
  forgotPassword,
  getAccountInfo,
  getNewAccessToken,
  changePassword,
  updateProfile,

  activeVip,
  cancelVip,
  getVipStatus,
};
