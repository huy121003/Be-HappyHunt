const { apiHandler } = require('../../helpers');
const otpService = require('./otp.service');

const sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;
  const formartPhone = phoneNumber.replace(/^0/, '+84');
  try {
    await otpService.sendOtpService(formartPhone, res);

    return apiHandler.sendSuccessMessage(res, 'OTP sent successfully');
  } catch (error) {
    return apiHandler.sendErrorMessage(res, 'OTP sent failed');
  }
};
const verifyOtp = async (req, res) => {
  const { otp, phoneNumber } = req.body;
  const formartPhone = phoneNumber.replace(/^0/, '+84');
  if (!otp) return apiHandler.sendErrorMessage(res, 'OTP is required');
  try {
    await otpService.verifyOtp(formartPhone, otp, res);
    return apiHandler.sendSuccessMessage(res, 'OTP verified successfully');
  } catch (error) {
    return apiHandler.sendErrorMessage(res, 'OTP is incorrect');
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
};
