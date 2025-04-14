const authService = require('./auth.service');
const { apiHandler } = require('../../helpers');
const { Account } = require('../../models');
const otpService = require('../otp/otp.service');

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body, res);
    return apiHandler.sendCreated(res, 'Login success', result);
  } catch (error) {
    if (error.message.includes('banned')) {
      return apiHandler.sendForbidden(res, 'Your account has been banned');
    }
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'The login information is incorrect');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred. Please try again later.'
    );
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
    const [account, user] = await Promise.all([
      Account.findOne({
        phoneNumber: req.body.phoneNumber,
      }),
      Account.findOne({
        username: req.body.username,
      }),
    ]);
    if (account || user)
      return apiHandler.sendConflict(
        res,
        'Phone number or username is already exist'
      );

    await otpService.sendOtp(req.body.phoneNumber);
    return apiHandler.sendCreated(res, 'OTP has been sent');
  } catch (error) {
    if (error.message.includes('creat:')) {
      return apiHandler.sendErrorMessage(res, 'Failed to send OTP');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred. Please try again later.'
    );
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
      return apiHandler.sendNotFound(res, 'Phone number is not verified');
    await otpService.sendOtp(req.body.phoneNumber);
    return apiHandler.sendCreated(res, 'OTP has been sent');
  } catch (error) {
    if (error.message.includes('create:')) {
      return apiHandler.sendErrorMessage(res, 'Failed to send OTP');
    }
    if (error.message.includes('unverified')) {
      return apiHandler.sendNotFound(res, 'Phone number is not verified');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred. Please try again later.'
    );
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
    if (error.message.includes('update:')) {
      return apiHandler.sendErrorMessage(res, 'Failed to reset password');
    }
    return apiHandler.sendErrorMessage(res, 'Failed to reset password');
  }
};

const getAccountInfo = async (req, res) => {
  try {
    const result = await authService.getAccountInfo(req.userAccess);
    return apiHandler.sendSuccessWithData(res, 'Account information', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Account not found');
    }
    return apiHandler.sendValidationError(
      res,
      'An unexpected error occurred. Please try again later.'
    );
  }
};

const getNewAccessToken = async (req, res) => {
  try {
    result = await authService.getNewAccessToken(req.userRefresh);
    return apiHandler.sendSuccessWithData(res, 'New access token', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Cannot find account');
    }
    return apiHandler.sendErrorMessage(res, 'Failed to retrieve account');
  }
};
const changePassword = async (req, res) => {
  try {
    await authService.changePassword(req.userAccess._id, req.body);
    res.clearCookie('refresh_token');
    return apiHandler.sendCreated(res, 'Change password success');
  } catch (error) {

    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Account not found');
    }
    if (error.message === 'validation') {
      return apiHandler.sendValidationError(
        res,
        'Current password is incorrect'
      );
    }
    if (error.message.includes('update:')) {
      return apiHandler.sendErrorMessage(res, 'Failed to change password');
    }
    return apiHandler.sendErrorMessage(res, 'An unexpected error occurred');
  }
};
const updateProfile = async (req, res) => {
  try {
 ;
    const result = await authService.updateProfile(req.userAccess._id, {
      ...req.body,
      ...(req?.files?.avatar && { avatar: req?.files?.avatar }),
      ...(req?.files?.background && { background: req?.files?.background }),
    });
    return apiHandler.sendCreated(res, 'Update profile success', result);
  } catch (error) {
   
    if (error.message === 'update') {
      return apiHandler.sendErrorMessage(res, 'Failed to update profile');
    }
    return apiHandler.sendErrorMessage(res, 'An unexpected error occurred');
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
