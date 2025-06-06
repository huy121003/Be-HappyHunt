const express = require('express');
const provinceController = require('./province.controller');
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
    PERMISSION_CODE_NAME.PROVINCES,
    PERMISSION_TYPE.CREATE
  ),
  provinceController.create
);

router.get(
  '/',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.PROVINCES,
    PERMISSION_TYPE.VIEW
  ),
  provinceController.getAll
);
router.get(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.PROVINCES,
    PERMISSION_TYPE.VIEW
  ),
  provinceController.getById
);
router.patch(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.PROVINCES,
    PERMISSION_TYPE.UPDATE
  ),
  provinceController.update
);
router.delete(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.PROVINCES,
    PERMISSION_TYPE.DELETE
  ),
  provinceController.remove
);
module.exports = router;
