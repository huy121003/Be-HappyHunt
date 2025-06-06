const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const { authJwt, permissionApi } = require('../../middlewares');
const {
  PERMISSION_CODE_NAME,
  PERMISSION_TYPE,
} = require('../../constants/constant');
router.use(authJwt.accessToken);
router.post(
  '/',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.ADMINS,
    PERMISSION_TYPE.CREATE
  ),
  adminController.create
);
router.get(
  '/',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.ADMINS,
    PERMISSION_TYPE.VIEW
  ),
  adminController.getAll
);
router.get(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.ADMINS,
    PERMISSION_TYPE.VIEW
  ),
  adminController.getById
);
router.patch(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.ADMINS,
    PERMISSION_TYPE.UPDATE
  ),
  adminController.update
);
router.delete(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.ADMINS,
    PERMISSION_TYPE.DELETE
  ),
  adminController.remove
);
router.patch(
  '/:id/banned',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.ADMINS,
    PERMISSION_TYPE.UPDATE
  ),
  adminController.banned
);

module.exports = router;
