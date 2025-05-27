const express = require('express');
const router = express.Router();
const otpController = require('./otp.controller');
router.post('/send', otpController.sendOtp);
router.post('/verify', otpController.verifyOtp);
router.post('/sendV2', otpController.sendOTPV2);
// router.post('/verifyV2', otpController.verifyOTPV2);
module.exports = router;
