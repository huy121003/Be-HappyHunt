const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { authJwt, permissionApi } = require('../../middlewares');
router.use(authJwt.accessToken);
router.get('/', permissionApi.permissionUser, userController.getAll);
router.get('/:id', permissionApi.permissionUser, userController.getById);
router.get(
  '/slug/:slug',
  permissionApi.permissionUser,
  userController.getBySlug
);

module.exports = router;
