const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {
  authMiddlewareAccessToken,
  authMiddlewareRefreshToken
} = require('../middlewares/authMiddleware');
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/register-otp', authController.sendOtpRegister);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/forgot-password-otp', authController.sendOtpForgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/get-account-info', authMiddlewareAccessToken, authController.getAccountInfo);
router.get('/get-new-access-token', authMiddlewareRefreshToken, authController.getNewAccessToken);
module.exports = router;