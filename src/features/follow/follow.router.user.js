const express = require('express');
const router = express.Router();
const { authJwt, permissionApi } = require('../../middlewares');
const followController = require('./follow.controller');
router.use(authJwt.accessToken);
router.post('/', permissionApi.permissionUser, followController.create);
router.get('/count/:id', permissionApi.permissionUser, followController.count);
router.get(
  '/pagination/:id',
  permissionApi.permissionUser,
  followController.getAllPagination
);
router.get('/:id', permissionApi.permissionUser, followController.getById);
router.delete('/:id', permissionApi.permissionUser, followController.remove);

module.exports = router;
