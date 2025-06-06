const express = require('express');
const wardController = require('./ward.controller');
const router = express.Router();
const { authJwt, permissionApi } = require('../../middlewares');

router.use(authJwt.accessToken);
router.get('/', permissionApi.permissionUser, wardController.getAll);

module.exports = router;
