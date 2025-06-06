const express = require('express');
const router = express.Router();
const postController = require('./post.controller');
const { authJwt, permissionApi } = require('../../middlewares');
const {
  PERMISSION_CODE_NAME,
  PERMISSION_TYPE,
} = require('../../constants/constant');
router.use(authJwt.accessToken);
router.patch(
  '/:id/status',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.POSTS,
    PERMISSION_TYPE.UPDATE
  ),
  postController.updateStatus
);
router.patch(
  '/:id/checking-status',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.POSTS,
    PERMISSION_TYPE.UPDATE
  ),
  postController.updateCheckingStatus
);

router.get(
  '/pagination',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.POSTS,
    PERMISSION_TYPE.VIEW
  ),
  postController.getAllPagination
);
router.get(
  '/pagination-manager',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.POSTS,
    PERMISSION_TYPE.VIEW
  ),
  postController.getAllPagiantionManager
);

router.get(
  '/total-post-selling',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.POSTS,
    PERMISSION_TYPE.VIEW
  ),
  postController.totalPostSelling
);
router.get(
  '/statistics',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.POSTS,
    PERMISSION_TYPE.VIEW
  ),
  postController.getNewPostStatistics
);
router.get(
  '/total-statistic-by-category',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.POSTS,
    PERMISSION_TYPE.VIEW
  ),
  postController.totalPostSellingByCategory
);
router.get(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.POSTS,
    PERMISSION_TYPE.VIEW
  ),
  postController.getById
);
router.delete(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.POSTS,
    PERMISSION_TYPE.DELETE
  ),
  postController.remove
);

module.exports = router;
