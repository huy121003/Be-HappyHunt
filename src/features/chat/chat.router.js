const express = require('express');
const chatController = require('./chat.controller');
const router = express.Router();
const { authJwt } = require('../../middlewares');

router.get('/:slug', authJwt.accessToken, chatController.getBySlug);

module.exports = router;
