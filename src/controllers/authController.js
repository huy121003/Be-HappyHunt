const {
  validationErrorWithData,
  sendValidationError,
  sendSuccessWithData,
  sendErrorMessage,
  sendNotFound,
  sendSuccessMessage,
  sendUnauthorizedError,
} = require('../helpers/apiHelper');
const uuid = require('uuid');
const { i18next } = require('../i18n');
const Account = require('../models/account');
const {
  loginService,
  registerService,
  forgotPasswordService,
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
    if (!result) {
      return sendValidationError(res, i18next.t('auth.invalid'));
    }
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
    const veryfyOtp = await verifyOtpService(phoneVn, otp);
    if (!veryfyOtp) {
      return sendValidationError(res, i18next.t('auth.invalid'));
    }

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
    const sendOtp = await sendOtpService(phoneVn);
    if (!sendOtp) {
      return sendValidationError(res, i18next.t('auth.invalid'));
    }
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
    if (!sendOtp) {
      return sendValidationError(res, i18next.t('auth.invalid'));
    }
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
    const veryfyOtp = await forgotPasswordService(phoneNumber, otp);
    if (!veryfyOtp) {
      return sendValidationError(res, i18next.t('auth.invalid'));
    }
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

module.exports = {
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
  sendOtpRegister,
  sendOtpForgotPassword,
};
