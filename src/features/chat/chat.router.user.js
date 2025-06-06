const express = require('express');
const chatController = require('./chat.controller');
const router = express.Router();
const { authJwt, permissionApi } = require('../../middlewares');

router.use(authJwt.accessToken);
router.get('/:slug', permissionApi.permissionUser, chatController.getBySlug);

module.exports = router;
