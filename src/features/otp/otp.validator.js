const { apiHandler } = require('../../helpers');

const sendOtp = (req, res, next) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber)
    return apiHandler.sendErrorMessage(res, 'Phone number is required');
  return next();
};
const verifyOtp = (req, res, next) => {
  const { otp, phoneNumber } = req.body;
  if (!phoneNumber || !otp)
    return apiHandler.sendErrorMessage(
      res,
      'Phone number and OTP are required'
    );
  return next();
};

module.exports = {
  sendOtp,
  verifyOtp,
};
