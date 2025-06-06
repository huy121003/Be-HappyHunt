const express = require('express');
const router = express.Router();
const postController = require('./post.controller');
const postValidation = require('./post.validation');
const { authJwt, permissionApi } = require('../../middlewares');
router.use(authJwt.accessToken);
router.post(
  '/',
  permissionApi.permissionUser,
  postValidation.create,
  postController.create
);
router.patch(
  '/:id/status',
  permissionApi.permissionUser,
  postController.updateStatus
);
router.get(
  '/count-status/:_id',
  permissionApi.permissionUser,
  postController.countStatus
);
router.get(
  '/pagination',
  permissionApi.permissionUser,
  postController.getAllPagination
);
router.get(
  '/pagination-manager',
  permissionApi.permissionUser,
  postController.getAllPagiantionManager
);
router.get(
  '/suggestion',
  permissionApi.permissionUser,
  postController.getAllSuggestionsPagination
);
router.get('/:id', permissionApi.permissionUser, postController.getById);
router.patch(
  '/push/:id',
  permissionApi.permissionUser,
  postController.updatePushedAt
);
router.get(
  '/push/:id',
  permissionApi.permissionUser,
  postController.getPushedAt
);
router.get(
  '/slug/:slug',
  permissionApi.permissionUser,
  postController.getBySlug
);
router.patch('/:id', postController.update);
router.get(
  '/count-sold/:id',
  permissionApi.permissionUser,
  postController.countSold
);
router.patch(
  '/click-count/:id',
  permissionApi.permissionUser,
  postController.updateClickCount
);
router.get(
  '/count-status-profile/:_id',
  permissionApi.permissionUser,
  postController.countStatusProfile
);

module.exports = router;
