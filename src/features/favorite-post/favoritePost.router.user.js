const express = require('express');
const favoritePostController = require('./favoritePost.controller');
const router = express.Router();

const { authJwt, permissionApi } = require('../../middlewares');
router.use(authJwt.accessToken);
router.delete(
  '/post/:id',
  permissionApi.permissionUser,
  favoritePostController.removeById
);
router.post('/', permissionApi.permissionUser, favoritePostController.create);
router.get(
  '/',
  permissionApi.permissionUser,
  favoritePostController.getAllPagination
);
router.get(
  '/:id',
  permissionApi.permissionUser,
  favoritePostController.getById
);
router.delete(
  '/:id',
  permissionApi.permissionUser,
  favoritePostController.remove
);

module.exports = router;
