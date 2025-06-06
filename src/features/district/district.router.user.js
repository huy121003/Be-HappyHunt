const express = require('express');
const districtController = require('./district.controller');
const router = express.Router();
const { authJwt, permissionApi } = require('../../middlewares');

router.use(authJwt.accessToken);
router.get('/', permissionApi.permissionUser, districtController.getAll);

module.exports = router;
