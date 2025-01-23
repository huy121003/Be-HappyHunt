const {
  sendValidationError,
  sendSuccessWithData,
  sendErrorMessage,
  sendNotFound,
  sendSuccessMessage,
} = require('../helpers/apiHelper');
const { i18next } = require('../i18n');
const Account = require('../models/account');
const {
  loginService,
  registerService,
  forgotPasswordService,
  getAccountInfoService,
  getNewAccessTokenService,
} = require('../services/authService');
const { verifyOtpService, sendOtpService } = require('../services/otpService');
const bcrypt = require('bcrypt');
const client = require('../configs/twilioConnect');
//TODO: Login function
const login = async (req, res) => {
  const { phoneNumber, password } = req.body;
  if (!phoneNumber || !password) {
    return valida(res, i18next.t('auth.required'), null);
  }
  try {
    const result = await loginService(phoneNumber, password, res);

    return sendSuccessWithData(res, i18next.t('auth.success'), result);
  } catch (error) {
    return sendErrorMessage(res, error.message);
  }
};
//TODO: Register function
const register = async (req, res) => {
  const { phoneNumber, password, otp } = req.body;
  if (!phoneNumber || !password || !otp) {
    return sendValidationError(res, i18next.t('auth.required'), null);
  }
  try {
    const phoneVn = `+84${phoneNumber.slice(1)}`;
    await verifyOtpService(phoneVn, otp);
    // Gọi service để xử lý đăng ký
    const registerResult = await registerService(phoneNumber, password);

    // Gửi kết quả trả về từ service
    return sendSuccessWithData(res, 'Đăng ký thành công', registerResult);
  } catch (error) {
    return sendErrorMessage(res, error.message);
  }
};
//TODO: Send OTP Register function
const sendOtpRegister = async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const account = await Account.findOne({ phoneNumber: phoneNumber });
    if (account) {
      return sendValidationError(res, i18next.t('auth.phoneExit'));
    }
    const phoneVn = `+84${phoneNumber.slice(1)}`;
    await sendOtpService(phoneVn);

    return sendSuccessMessage(res, 'Mã OTP đã được gửi');
  } catch (error) {
    return sendErrorMessage(res, error.message);
  }
};
//TODO: Logout function
const logout = async (req, res) => {
  // logout logic
};
//TODO: Send OTP Forgot Password function
const sendOtpForgotPassword = async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return sendValidationError(res, i18next.t('auth.required'), null);
  }
  try {
    const account = await Account.findOne({ phoneNumber: phoneNumber });
    if (!account) {
      return sendValidationError(res, i18next.t('auth.invalid'));
    }
    const phoneVn = `+84${phoneNumber.slice(1)}`;
    const sendOtp = await sendOtpService(phoneVn);

    return sendSuccessMessage(res, 'Mã OTP đã được gửi');
  } catch (error) {
    return sendErrorMessage(res, error.message);
  }
};
//TODO:  Forgot Password function
const forgotPassword = async (req, res) => {
  const { phoneNumber, otp } = req.body;
  if (!phoneNumber || !otp) {
    return sendValidationError(res, i18next.t('auth.required'), null);
  }
  try {
    await forgotPasswordService(phoneNumber, otp);

    return sendSuccessMessage(
      res,
      `Mật khẩu mới đã được gửi về số điện thoại ${phoneNumber}`
    );
  } catch (error) {
    return sendErrorMessage(res, error.message);
  }
};
//TODO: Reset Password function
const resetPassword = async (req, res) => {
  // reset password logic
};
//TODO Get Account Info function
const getAccountInfo = async (req, res) => {
  const { phoneNUmber, _id } = req.userAccess;
  try {
    const result = await getAccountInfoService(phoneNUmber, _id);

    return sendSuccessWithData(res, 'Thông tin người dùng', result);
  } catch (error) {
    return sendErrorMessage(res, error.message);
  }
};
//TODO Get new access token function
const getNewAccessToken = async (req, res) => {
  const { _id, phoneNumber } = req.userRefresh;
  try {
    result = await getNewAccessTokenService(_id, phoneNumber);
    return sendSuccessWithData(res, 'Access token mới', result);
  } catch (error) {
    return sendErrorMessage(res, error.message);
  }
};

module.exports = {
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
  sendOtpRegister,
  sendOtpForgotPassword,
  getAccountInfo,
  getNewAccessToken,
};
