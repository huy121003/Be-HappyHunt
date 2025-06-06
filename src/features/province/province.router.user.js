const express = require('express');
const provinceController = require('./province.controller');
const router = express.Router();
const { authJwt, permissionApi } = require('../../middlewares');
router.use(authJwt.accessToken);
router.get('/', permissionApi.permissionUser, provinceController.getAll);

module.exports = router;
