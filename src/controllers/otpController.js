const {
  sendSuccessMessage,
  sendErrorMessage,
} = require('../helpers/apiHelper');
const { sendOtpService, verifyOtpService } = require('../services/otpService');
const sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) return sendErrorMessage(res, 'Phone number is required');
  const formartPhone = phoneNumber.replace(/^0/, '+84');
  try {
    const result = await sendOtpService(formartPhone, res);
    if (result) return sendSuccessMessage(res, 'OTP sent successfully');
    return sendErrorMessage(res, 'OTP sent failed');
  } catch (error) {
    return sendErrorMessage(res, 'OTP sent failed');
  }
};
const verifyOtp = async (req, res) => {
  const { otp, phoneNumber } = req.body;
  if (!phoneNumber || !otp)
    return sendErrorMessage(res, 'Phone number and OTP are required');
  const formartPhone = phoneNumber.replace(/^0/, '+84');
  if (!otp) return sendErrorMessage(res, 'OTP is required');
  try {
    const result = await verifyOtpService(formartPhone, otp, res);
    if (!result) return sendErrorMessage(res, 'OTP is incorrect');
    return sendSuccessMessage(res, 'OTP verified successfully');
  } catch (error) {
    return sendErrorMessage(res, 'OTP is incorrect');
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
};
