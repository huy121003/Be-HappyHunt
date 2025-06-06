const express = require('express');
const router = express.Router();
const fileController = require('./file.controller');
const { authJwt } = require('../../middlewares');
router.use(authJwt.accessToken);
router.post('/single', fileController.uploadSingle);
router.post('/multiple', fileController.uploadMultiple);
module.exports = router;
