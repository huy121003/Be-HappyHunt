const express = require('express');
const payosController = require('./payos.controller');
const router = express.Router();

const { authJwt, permissionApi } = require('../../middlewares');

router.use(authJwt.accessToken);
router.post(
  '/create-payment-link',
  permissionApi.permissionUser,
  payosController.createPaymentLink
);

module.exports = router;
