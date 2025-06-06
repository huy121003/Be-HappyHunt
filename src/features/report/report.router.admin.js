const express = require('express');
const router = express.Router();
const reportController = require('./report.controller');
const { authJwt, permissionApi } = require('../../middlewares');
const {
  PERMISSION_CODE_NAME,
  PERMISSION_TYPE,
} = require('../../constants/constant');
router.use(authJwt.accessToken);
router.get(
  '/',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.REPORTS,
    PERMISSION_TYPE.VIEW
  ),
  reportController.getAll
);
router.get(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.REPORTS,
    PERMISSION_TYPE.VIEW
  ),
  reportController.getById
);
router.patch(
  '/:id/status',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.REPORTS,
    PERMISSION_TYPE.UPDATE
  ),
  reportController.updateStatus
);
router.delete(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.REPORTS,
    PERMISSION_TYPE.DELETE
  ),
  reportController.remove
);

module.exports = router;
