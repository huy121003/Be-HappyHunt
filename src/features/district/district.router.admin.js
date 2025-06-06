const express = require('express');
const districtController = require('./district.controller');
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
    PERMISSION_CODE_NAME.DISTRICTS,
    PERMISSION_TYPE.CREATE
  ),
  districtController.create
);
router.get(
  '/',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.DISTRICTS,
    PERMISSION_TYPE.VIEW
  ),
  districtController.getAll
);
router.get(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.DISTRICTS,
    PERMISSION_TYPE.VIEW
  ),
  districtController.getById
);
router.patch(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.DISTRICTS,
    PERMISSION_TYPE.UPDATE
  ),
  districtController.update
);
router.delete(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.DISTRICTS,
    PERMISSION_TYPE.DELETE
  ),
  districtController.remove
);
module.exports = router;
