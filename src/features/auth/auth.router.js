const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { authJwt } = require('../../middlewares');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/register-otp', authController.sendOtpRegister);
router.post('/logout', authJwt.accessToken, authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/forgot-password-otp', authController.sendOtpForgotPassword);

router.get(
  '/get-account-info',
  authJwt.accessToken,
  authController.getAccountInfo
);
router.get(
  '/get-new-access-token',
  authJwt.refreshToken,
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
