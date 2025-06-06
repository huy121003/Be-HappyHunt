const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { authJwt, permissionApi } = require('../../middlewares');
const {
  PERMISSION_CODE_NAME,
  PERMISSION_TYPE,
} = require('../../constants/constant');
router.use(authJwt.accessToken);
router.get(
  '/statistics',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.USERS,
    PERMISSION_TYPE.VIEW
  ),
  userController.getNewAccountStatistics
);
router.get(
  '/new-user',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.USERS,
    PERMISSION_TYPE.VIEW
  ),
  userController.getNewUser
);
router.get(
  '/new-user/statistics',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.USERS,
    PERMISSION_TYPE.VIEW
  ),
  userController.getNewUserStatistics
);
router.get(
  '/count-gender-user',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.USERS,
    PERMISSION_TYPE.VIEW
  ),
  userController.countGenderUser
);
router.get(
  '/total-user',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.USERS,
    PERMISSION_TYPE.VIEW
  ),
  userController.totalUser
);
router.get(
  '/',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.USERS,
    PERMISSION_TYPE.VIEW
  ),
  userController.getAll
);
router.get(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.USERS,
    PERMISSION_TYPE.VIEW
  ),
  userController.getById
);
router.delete(
  '/:id',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.USERS,
    PERMISSION_TYPE.DELETE
  ),
  userController.remove
);
router.patch(
  '/:id/banned',
  permissionApi.permissionAdmin(
    PERMISSION_CODE_NAME.USERS,
    PERMISSION_TYPE.UPDATE
  ),
  userController.banned
);

module.exports = router;
