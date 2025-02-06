const { apiHandler } = require('../../helpers');

const login = async (req, res, next) => {
  const { phoneNumber, password } = req.body;
  if (!phoneNumber || !password) {
    return apiHandler.sendValidationError(
      res,
      i18next.t('auth.required'),
      null
    );
  }
  next();
};
const register = async (req, res, next) => {
  const { phoneNumber, password, otp } = req.body;
  if (!phoneNumber || !password || !otp) {
    return apiHandler.sendValidationError(
      res,
      i18next.t('auth.required'),
      null
    );
  }
  if (phoneNumber.length < 10 || phoneNumber.length > 11) {
    return apiHandler.sendValidationError(res, i18next.t('auth.invalid'), null);
  }
  if (
    password.length < 8 ||
    !password.match(/[a-z]/) ||
    !password.match(/[A-Z]/) ||
    !password.match(/[0-9]/)
  ) {
    return apiHandler.sendValidationError(res, i18next.t('auth.invalid'), null);
  }

  next();
};
const sendOtpRegister = async (req, res, next) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return apiHandler.sendValidationError(
      res,
      i18next.t('auth.required'),
      null
    );
  }

  next();
};
const sendOtpForgotPassword = async (req, res, next) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return apiHandler.sendValidationError(
      res,
      i18next.t('auth.required'),
      null
    );
  }
  next();
};
const forgotPassword = async (req, res, next) => {
  const { phoneNumber, otp } = req.body;
  if (!phoneNumber || !otp) {
    return apiHandler.sendValidationError(
      res,
      i18next.t('auth.required'),
      null
    );
  }
  next();
};
const getAccountInfo = async (req, res, next) => {
  const { phoneNumber, _id } = req.userAccess;
  if (!phoneNumber || !_id) {
    return apiHandler.sendValidationError(
      res,
      i18next.t('auth.required'),
      null
    );
  }
  next();
};
const getNewAccessToken = async (req, res, next) => {
  const { _id, phoneNumber } = req.userRefresh;
  if (!_id || !phoneNumber) {
    return apiHandler.sendValidationError(
      res,
      i18next.t('auth.required'),
      null
    );
  }
  next();
};

module.exports = {
  login,
  register,
  sendOtpRegister,
  forgotPassword,
  sendOtpForgotPassword,
  getAccountInfo,
  getNewAccessToken,
};
