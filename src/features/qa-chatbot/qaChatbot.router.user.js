const express = require('express');
const qaChatbotController = require('./qaChatBot.controller');
const router = express.Router();

const { authJwt, permissionApi } = require('../../middlewares');
router.use(authJwt.accessToken);
router.post(
  '/answer',
  permissionApi.permissionUser,
  qaChatbotController.getAnswer
);
router.post(
  '/description',
  permissionApi.permissionUser,
  qaChatbotController.getDescription
);

module.exports = router;
