const authService = require('./auth.service');
const { apiHandler } = require('../../helpers');
const { Account } = require('../../models');
const otpService = require('../otp/otp.service');

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body, res);
    return apiHandler.sendCreated(res, 'Login success', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};

const register = async (req, res) => {
  try {
    const registerResult = await authService.register(req.body);
    return apiHandler.sendCreated(res, 'Register success', registerResult);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};

const sendOtpRegister = async (req, res) => {
  try {
    const account = await Account.findOne({
      phoneNumber: req.body.phoneNumber,
    });
    if (account) return apiHandler.sendErrorMessage(res, 'Phone number exists');
    const user = await Account.findOne({
      username: req.body.username,
    });
    if (user) return apiHandler.sendErrorMessage(res, 'Username exists');
    await otpService.sendOtp(req.body.phoneNumber);
    return apiHandler.sendCreated(res, 'OTP has been sent');
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};

const logout = async (req, res) => {
  // logout logic
  res.clearCookie('refresh_token');
  return apiHandler.sendCreated(res, 'Logout success');
};

const sendOtpForgotPassword = async (req, res) => {
  try {
    const account = await Account.findOne({
      phoneNumber: req.body.phoneNumber,
    });
    if (!account)
      return apiHandler.sendValidationError(res, 'Phone number does not exist');
    await otpService.sendOtp(req.body.phoneNumber);
    return apiHandler.sendCreated(res, 'OTP has been sent');
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};

const forgotPassword = async (req, res) => {
  try {
    await authService.forgotPassword(req.body);
    return apiHandler.sendCreated(
      res,
      `Reset password success, please check your phone number ${req.body.phoneNumber} to get new password`
    );
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};

const getAccountInfo = async (req, res) => {
  try {
    const result = await authService.getAccountInfo(req.userAccess);
    return apiHandler.sendSuccessWithData(res, 'Account information', result);
  } catch (error) {
    return apiHandler.sendValidationError(res, error.message);
  }
};

const getNewAccessToken = async (req, res) => {
  try {
    result = await authService.getNewAccessToken(req.userRefresh);
    return apiHandler.sendSuccessWithData(res, 'New access token', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const changePassword = async (req, res) => {
  try {
    await authService.changePassword(req.userAccess._id, req.body);
    res.clearCookie('refresh_token');
    return apiHandler.sendCreated(res, 'Change password success');
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const updateProfile = async (req, res) => {
  try {
    const result = await authService.updateProfile(req.userAccess._id, {
      ...req.body,
      ...(req.files && { avatar: req.files.avatar }),
    });
    return apiHandler.sendCreated(res, 'Update profile success', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};

module.exports = {
  login,
  register,
  sendOtpRegister,
  logout,
  sendOtpForgotPassword,
  forgotPassword,
  getAccountInfo,
  getNewAccessToken,
  changePassword,
  updateProfile,
};
