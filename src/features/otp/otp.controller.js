const { apiHandler } = require('../../helpers');
const otpService = require('./otp.service');

const sendOtp = async (req, res) => {
  try {
    await otpService.sendOtp(req.body.phoneNumber);
    return apiHandler.sendCreated(res, 'OTP sent successfully');
  } catch (error) {
    return apiHandler.sendErrorMessage(res, 'OTP sent failed');
  }
};
const verifyOtp = async (req, res) => {
  try {
    await otpService.verifyOtp(req.body);
    return apiHandler.sendCreated(res, 'OTP verified successfully');
  } catch (error) {
    return apiHandler.sendErrorMessage(res, 'OTP is incorrect');
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
};
