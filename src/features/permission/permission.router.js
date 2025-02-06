const express = require('express');
const permissionController = require('./permission.controller');
const router = express.Router();

const { authJwt } = require('../../middlewares');
const permissionValidator = require('./permission.validator');

router.get(
  '/',
  authJwt.accessToken,
  permissionValidator.getAllPermission,
  permissionController.getAllPermission
);
router.get(
  '/pagination',
  authJwt.accessToken,
  permissionValidator.getAllPermissionWithPagination,
  permissionController.getAllPermissionWithPagination
);
router.get(
  '/:id',
  authJwt.accessToken,
  permissionValidator.getPermissionById,
  permissionController.getPermissionById
);
router.post(
  '/',
  authJwt.accessToken,
  permissionValidator.createAPermission,
  permissionController.createAPermission
);
router.patch(
  '/:id',
  authJwt.accessToken,
  permissionValidator.updateAPermisson,
  permissionController.updateAPermisson
);
router.delete(
  '/:id',
  authJwt.accessToken,
  permissionValidator.deleteAPermission,
  permissionController.deleteAPermission
);

module.exports = router;
