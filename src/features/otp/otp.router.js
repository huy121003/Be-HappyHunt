const express = require('express');
const router = express.Router();
const otpValidator = require('./otp.validator');
const otpController = require('./otp.controller');
router.post('/send', otpValidator.sendOtp, otpController.sendOtp);
router.post('/verify', otpValidator.verifyOtp, otpController.verifyOtp);
module.exports = router;
