const express = require('express');
const paymentController = require('./payment.controller');
const router = express.Router();
const { authJwt, permissionApi } = require('../../middlewares');
router.use(authJwt.accessToken);

router.get(
  '/by-user',
  permissionApi.permissionUser,
  paymentController.getAllByUser
);
router.patch(
  '/:id/update-status',
  permissionApi.permissionUser,
  paymentController.updateStatus
);
router.get('/:id', permissionApi.permissionUser, paymentController.getById);
router.post(
  '/:id/status',
  permissionApi.permissionUser,
  paymentController.checkStatus
);

module.exports = router;
