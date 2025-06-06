const express = require('express');
const paymentController = require('./payment.controller');
const router = express.Router();
const { authJwt, permissionApi } = require('../../middlewares');
const {
  PERMISSION_CODE_NAME,
  PERMISSION_TYPE,
} = require('../../constants/constant');
router.use(authJwt.accessToken);
router.get(
  '/top5',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.PAYMENTS,
    PERMISSION_TYPE.VIEW
  ),
  paymentController.getTopDepositors
);
router.get(
  '/pagination',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.PAYMENTS,
    PERMISSION_TYPE.VIEW
  ),
  paymentController.getAllPagiantion
);
router.get(
  '/statistic',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.PAYMENTS,
    PERMISSION_TYPE.VIEW
  ),
  paymentController.getDepositStatistics
);
router.delete(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.PAYMENTS,
    PERMISSION_TYPE.DELETE
  ),
  paymentController.remove
);

module.exports = router;
