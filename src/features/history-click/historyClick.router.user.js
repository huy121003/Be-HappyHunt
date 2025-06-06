const express = require('express');
const router = express.Router();
const historyClickController = require('./historyClick.controller');
const { authJwt, permissionApi } = require('../../middlewares');
router.use(authJwt.accessToken);
router.get(
  '/:id',
  permissionApi.permissionUser,
  historyClickController.getAllByPostId
);
router.get(
  '/:id/count-every-day',
  permissionApi.permissionUser,
  historyClickController.countClicksByDay
);

module.exports = router;
