const express = require('express');
const searchController = require('./search.controller');
const router = express.Router();
const { authJwt, permissionApi } = require('../../middlewares');
router.use(authJwt.accessToken);
router.get(
  '/pagination',
  permissionApi.permissionUser,
  searchController.getAllPagination
);
router.post('/', permissionApi.permissionUser, searchController.create);
router.delete('/:id', permissionApi.permissionUser, searchController.remove);
module.exports = router;
