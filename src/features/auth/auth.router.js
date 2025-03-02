const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const authValidator = require('./auth.validator');
const { authJwt } = require('../../middlewares');

router.post('/login', authValidator.login, authController.login);
router.post('/register', authValidator.register, authController.register);
router.post(
  '/register-otp',
  authValidator.sendOtpRegister,
  authController.sendOtpRegister
);
router.post('/logout', authJwt.accessToken, authController.logout);
router.post(
  '/forgot-password',
  authValidator.forgotPassword,
  authController.forgotPassword
);
router.post(
  '/forgot-password-otp',
  authValidator.sendOtpForgotPassword,
  authController.sendOtpForgotPassword
);

router.get(
  '/get-account-info',
  authJwt.accessToken,
  authValidator.getAccountInfo,
  authController.getAccountInfo
);
router.get(
  '/get-new-access-token',
  authJwt.refreshToken,
  authValidator.getNewAccessToken,
  authController.getNewAccessToken
);
router.patch(
  '/change-password',
  authJwt.accessToken,
  authController.changePassword
);
router.patch(
  '/update-profile',
  authJwt.accessToken,
  authController.updateProfile
);
module.exports = router;
