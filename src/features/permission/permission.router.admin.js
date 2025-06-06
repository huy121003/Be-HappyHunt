const express = require('express');
const permissionController = require('./permission.controller');
const router = express.Router();

const { authJwt, permissionApi } = require('../../middlewares');
const {
  PERMISSION_CODE_NAME,
  PERMISSION_TYPE,
} = require('../../constants/constant');
router.use(authJwt.accessToken);
router.get(
  '/',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.PERMISSIONS,
    PERMISSION_TYPE.VIEW
  ),
  permissionController.getAll
);
router.get(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.PERMISSIONS,
    PERMISSION_TYPE.VIEW
  ),
  permissionController.getById
);
router.post(
  '/',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.PERMISSIONS,
    PERMISSION_TYPE.CREATE
  ),
  permissionController.create
);
router.patch(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.PERMISSIONS,
    PERMISSION_TYPE.UPDATE
  ),
  permissionController.update
);
router.delete('/:id', permissionController.remove);
router.get(
  '/pagination',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.PERMISSIONS,
    PERMISSION_TYPE.VIEW
  ),
  permissionController.getAllPagination
);

module.exports = router;
