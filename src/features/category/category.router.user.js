const express = require('express');
const categoryController = require('./category.controller');
const router = express.Router();
const { authJwt, permissionApi } = require('../../middlewares');

router.use(authJwt.accessToken);
router.get('/', permissionApi.permissionUser, categoryController.getAll);
router.get(
  '/parent',
  permissionApi.permissionUser,
  categoryController.getAllParent
);
router.get(
  '/child/:id',
  permissionApi.permissionUser,
  categoryController.getAllChild
);
router.get('/:id', permissionApi.permissionUser, categoryController.getById);
router.get(
  '/slug/:slug',
  permissionApi.permissionUser,
  categoryController.getBySlug
);
module.exports = router;
