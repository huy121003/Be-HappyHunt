const express = require('express');
const categoryController = require('./category.controller');
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
    PERMISSION_CODE_NAME.CATEGORIES,
    PERMISSION_TYPE.CREATE
  ),
  categoryController.create
);
router.get(
  '/pagination',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.CATEGORIES,
    PERMISSION_TYPE.VIEW
  ),
  categoryController.getAllPagination
);
router.get(
  '/',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.CATEGORIES,
    PERMISSION_TYPE.VIEW
  ),
  categoryController.getAll
);
router.get(
  '/parent',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.CATEGORIES,
    PERMISSION_TYPE.VIEW
  ),
  categoryController.getAllParent
);
router.get(
  '/child/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.CATEGORIES,
    PERMISSION_TYPE.VIEW
  ),
  categoryController.getAllChild
);
router.get(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.CATEGORIES,
    PERMISSION_TYPE.VIEW
  ),
  categoryController.getById
);
router.patch(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.CATEGORIES,
    PERMISSION_TYPE.UPDATE
  ),
  categoryController.update
);
router.delete(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.CATEGORIES,
    PERMISSION_TYPE.DELETE
  ),
  categoryController.remove
);
module.exports = router;
