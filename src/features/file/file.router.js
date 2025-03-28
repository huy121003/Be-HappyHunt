const express = require('express');
const router = express.Router();
const fileController = require('./file.controller');
const { authJwt } = require('../../middlewares');
router.post(
  '/single',
  authJwt.accessToken,
  fileController.uploadSingle
);
router.post(
  '/multiple',
  authJwt.accessToken,
  fileController.uploadMultiple
);
module.exports = router;
