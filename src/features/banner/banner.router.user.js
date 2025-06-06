const express = require('express');

const bannerController = require('./banner.controller');
const router = express.Router();
const { authJwt, permissionApi } = require('../../middlewares');
router.use(authJwt.accessToken);
router.get('/', permissionApi.permissionUser, bannerController.getAll);

module.exports = router;
