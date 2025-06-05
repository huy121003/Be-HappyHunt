const { apiHandler } = require('../../helpers');
const otpService = require('./otp.service');

const sendOtp = async (req, res) => {
  try {
    await otpService.sendOtp(req.body.email);
    return apiHandler.sendCreated(res, 'OTP sent successfully');
  } catch (error) {
    if (error.message.includes('create')) {
      return apiHandler.sendErrorMessage(res, 'Failed to send OTP');
    }

    return apiHandler.sendErrorMessage(res, 'OTP sent failed');
  }
};
const verifyOtp = async (req, res) => {
  try {
    await otpService.verifyOtp(req.body);
    return apiHandler.sendCreated(res, 'OTP verified successfully');
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'OTP not found');
    }
    if (error.message.includes('incorrect')) {
      return apiHandler.sendErrorMessage(res, 'OTP is incorrect');
    }
    return apiHandler.sendErrorMessage(res, 'OTP verification failed');
  }
};
const sendOTPV2 = async (req, res) => {
  const { email } = req.body;
  try {
    const session = await auth.createUser({
      email: email,
    });

    return apiHandler.sendCreated(res, 'OTP sent successfully', session);
  } catch (error) {
    return apiHandler.sendErrorMessage(
      res,
      'Failed to send OTP',
      error.message
    );
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  sendOTPV2,
};
