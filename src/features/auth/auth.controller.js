const bcrypt = require('bcrypt');
const authService = require('./auth.service');
const { apiHandler } = require('../../helpers');
const { Account } = require('../../models');
const { i18next } = require('../../configs').translateConfig;
const otpService = require('../otp/otp.service');
const authController = {
  //TODO: Login function
  login: async (req, res) => {
    const { phoneNumber, password } = req.body;

    try {
      const result = await authService.login(phoneNumber, password, res);

      return apiHandler.sendSuccessWithData(
        res,
        i18next.t('auth.success'),
        result
      );
    } catch (error) {
      return apiHandler.sendErrorMessage(res, error.message);
    }
  },
  //TODO: Register function
  register: async (req, res) => {
    const { phoneNumber, password, otp } = req.body;
    try {
      const phoneVn = `+84${phoneNumber.slice(1)}`;
      await otpService.verifyOtp(phoneVn, otp);
      // Gọi service để xử lý đăng ký
      const registerResult = await authService.register(phoneNumber, password);

      // Gửi kết quả trả về từ service
      return apiHandler.sendSuccessWithData(
        res,
        'Đăng ký thành công',
        registerResult
      );
    } catch (error) {
      return apiHandler.sendErrorMessage(res, error.message);
    }
  },
  //TODO: Send OTP Register function
  sendOtpRegister: async (req, res) => {
    const { phoneNumber } = req.body;
    try {
      const account = await Account.findOne({ phoneNumber: phoneNumber });
      if (account) {
        return sendValidationError(res, i18next.t('auth.phoneExit'));
      }
      const phoneVn = `+84${phoneNumber.slice(1)}`;
      await otpService.sendOtp(phoneVn);
      return apiHandler.sendSuccessMessage(res, 'Mã OTP đã được gửi');
    } catch (error) {
      return apiHandler.sendErrorMessage(res, error.message);
    }
  },
  //TODO: Logout function
  logout: async (req, res) => {
    // logout logic
  },
  //TODO: Send OTP Forgot Password function
  sendOtpForgotPassword: async (req, res) => {
    const { phoneNumber } = req.body;
    try {
      const account = await Account.findOne({ phoneNumber: phoneNumber });
      if (!account) {
        return sendValidationError(res, i18next.t('auth.invalid'));
      }
      const phoneVn = `+84${phoneNumber.slice(1)}`;
      await otpService.sendOtp(phoneVn);

      return apiHandler.sendSuccessMessage(res, 'Mã OTP đã được gửi');
    } catch (error) {
      return apiHandler.sendErrorMessage(res, error.message);
    }
  },
  //TODO:  Forgot Password function
  forgotPassword: async (req, res) => {
    const { phoneNumber, otp } = req.body;

    try {
      await authService.forgotPassword(phoneNumber, otp);

      return apiHandler.sendSuccessMessage(
        res,
        `Mật khẩu mới đã được gửi về số điện thoại ${phoneNumber}`
      );
    } catch (error) {
      return apiHandler.sendErrorMessage(res, error.message);
    }
  },
  //TODO: Reset Password function
  resetPassword: async (req, res) => {
    // reset password logic
  },
  //TODO Get Account Info function
  getAccountInfo: async (req, res) => {
    const { phoneNUmber, _id } = req.userAccess;
    try {
      const result = await authService.getAccountInfo(phoneNUmber, _id);

      return apiHandler.sendSuccessWithData(
        res,
        'Thông tin người dùng',
        result
      );
    } catch (error) {
      return apiHandler.sendErrorMessage(res, error.message);
    }
  },
  //TODO Get new access token function
  getNewAccessToken: async (req, res) => {
    const { _id, phoneNumber } = req.userRefresh;
    try {
      result = await authService.getNewAccessToken(_id, phoneNumber);
      return apiHandler.sendSuccessWithData(res, 'Access token mới', result);
    } catch (error) {
      return apiHandler.sendErrorMessage(res, error.message);
    }
  },
};
module.exports = authController;
