const express = require('express');
const wardController = require('./ward.controller');
const router = express.Router();
const { authJwt, permissionApi } = require('../../middlewares');
const {
  PERMISSION_CODE_NAME,
  PERMISSION_TYPE,
} = require('../../constants/constant');
router.use(authJwt.accessToken);
router.post(
  '/',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.WARDS,
    PERMISSION_TYPE.CREATE
  ),
  wardController.create
);
router.get(
  '/',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.WARDS,
    PERMISSION_TYPE.VIEW
  ),
  wardController.getAll
);
router.get(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.WARDS,
    PERMISSION_TYPE.VIEW
  ),
  wardController.getById
);
router.patch(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.WARDS,
    PERMISSION_TYPE.UPDATE
  ),
  wardController.update
);
router.delete(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.WARDS,
    PERMISSION_TYPE.DELETE
  ),
  wardController.remove
);

module.exports = router;
