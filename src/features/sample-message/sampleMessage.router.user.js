const express = require('express');
const router = express.Router();
const sampleMessageController = require('./sampleMessage.controller');
const { authJwt, permissionApi } = require('../../middlewares');
router.use(authJwt.accessToken);
router.post('/', permissionApi.permissionUser, sampleMessageController.create);
router.get('/', permissionApi.permissionUser, sampleMessageController.getAll);
router.patch(
  '/:id',
  permissionApi.permissionUser,
  sampleMessageController.update
);
router.delete(
  '/:id',
  permissionApi.permissionUser,
  sampleMessageController.remove
);
router.get(
  '/:id',
  permissionApi.permissionUser,
  sampleMessageController.getById
);

module.exports = router;
