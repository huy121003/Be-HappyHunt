const express = require('express');
const router = express.Router();
const fileController = require('./file.controller');
const fileValidator = require('./file.validator');
const { authJwt } = require('../../middlewares');
router.post(
  '/single',
  authJwt.accessToken,
  fileValidator.uploadSingle,
  fileController.uploadSingle
);
router.post(
  '/multiple',
  authJwt.accessToken,
  fileValidator.uploadMultiple,
  fileController.uploadMultiple
);
module.exports = router;
