const express = require('express');
const router = express.Router();
const roleController = require('./role.controller');
const { authJwt, permissionApi } = require('../../middlewares');
const {
  PERMISSION_CODE_NAME,
  PERMISSION_TYPE,
} = require('../../constants/constant');
router.use(authJwt.accessToken);
router.get(
  '/',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.ROLES,
    PERMISSION_TYPE.VIEW
  ),
  roleController.getAll
);
router.get(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.ROLES,
    PERMISSION_TYPE.VIEW
  ),
  roleController.getById
);
router.post(
  '/',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.ROLES,
    PERMISSION_TYPE.CREATE
  ),
  roleController.create
);
router.patch(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.ROLES,
    PERMISSION_TYPE.UPDATE
  ),
  roleController.update
);
router.delete(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.ROLES,
    PERMISSION_TYPE.DELETE
  ),
  roleController.remove
);

module.exports = router;
