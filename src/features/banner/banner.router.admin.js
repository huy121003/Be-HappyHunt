const express = require('express');

const bannerController = require('./banner.controller');
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
    PERMISSION_CODE_NAME.BANNERS,
    PERMISSION_TYPE.CREATE
  ),
  bannerController.create
);
router.get(
  '/pagination',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.BANNERS,
    PERMISSION_TYPE.VIEW
  ),
  bannerController.getAllPagination
);
router.get(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.BANNERS,
    PERMISSION_TYPE.VIEW
  ),
  bannerController.getById
);
router.patch(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.BANNERS,
    PERMISSION_TYPE.UPDATE
  ),
  bannerController.update
);
router.delete(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.BANNERS,
    PERMISSION_TYPE.DELETE
  ),

  bannerController.remove
);
router.patch(
  '/:id/show',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.BANNERS,
    PERMISSION_TYPE.UPDATE
  ),
  bannerController.show
);
module.exports = router;
