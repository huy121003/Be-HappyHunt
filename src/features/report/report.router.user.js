const express = require('express');
const router = express.Router();
const reportController = require('./report.controller');
const { authJwt, permissionApi } = require('../../middlewares');
router.use(authJwt.accessToken);
router.post('/', permissionApi.permissionUser, reportController.create);

module.exports = router;
