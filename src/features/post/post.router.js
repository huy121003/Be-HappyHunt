const express = require('express');
const router = express.Router();
const postController = require('./post.controller');
const postValidation = require('./post.validation');
const { authJwt } = require('../../middlewares');

router.post(
  '/',
  authJwt.accessToken,
  postValidation.create,
  postController.create
);
router.patch('/:id/status', authJwt.accessToken, postController.updateStatus);
router.patch(
  '/:id/checking-status',
  authJwt.accessToken,
  postController.updateCheckingStatus
);
router.get(
  '/count-status/:_id',
  authJwt.accessToken,
  postController.countStatus
);
router.get('/pagination', authJwt.accessToken, postController.getAllPagination);
router.get(
  '/pagination-manager',
  authJwt.accessToken,
  postController.getAllPagiantionManager
);
router.get(
  '/suggestion',
  authJwt.accessToken,
  postController.getAllSuggestionsPagination
);
router.get(
  '/total-post-selling',
  authJwt.accessToken,
  postController.totalPostSelling
);
router.get(
  '/statistics',
  authJwt.accessToken,
  postController.getNewPostStatistics
);
router.get(
  '/total-statistic-by-category',
  authJwt.accessToken,
  postController.totalPostSellingByCategory
);
router.get('/:id', authJwt.accessToken, postController.getById);
router.delete('/:id', authJwt.accessToken, postController.remove);
router.patch('/push/:id', authJwt.accessToken, postController.updatePushedAt);
router.get('/push/:id', authJwt.accessToken, postController.getPushedAt);
router.get('/slug/:slug', authJwt.accessToken, postController.getBySlug);
router.patch('/:id', authJwt.accessToken, postController.update);
router.get('/count-sold/:id', authJwt.accessToken, postController.countSold);
router.patch(
  '/click-count/:id',
  authJwt.accessToken,
  postController.updateClickCount
);

router.patch(
  '/pushed-at/:id',
  authJwt.accessToken,
  postController.updatePushedAt
);
router.get(
  '/count-status-profile/:_id',
  authJwt.accessToken,
  postController.countStatusProfile
);

module.exports = router;
