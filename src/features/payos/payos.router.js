const express = require('express');
const payosController = require('./payos.controller');
const router = express.Router();

const { authJwt } = require('../../middlewares');

//router.post('/webhook', payosController.webhook);
router.post(
  '/create-payment-link',
  authJwt.accessToken,
  payosController.createPaymentLink
);

module.exports = router;
