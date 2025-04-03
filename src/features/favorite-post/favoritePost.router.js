const express = require('express');
const favoritePostController = require('./favoritePost.controller');
const router = express.Router();

const { authJwt } = require('../../middlewares');
router.delete(
  '/post/:id',
  authJwt.accessToken,
  favoritePostController.removeById
);
router.post('/', authJwt.accessToken, favoritePostController.create);
router.get('/', authJwt.accessToken, favoritePostController.getAllPagination);
router.get('/:id', authJwt.accessToken, favoritePostController.getById);
router.delete('/:id', authJwt.accessToken, favoritePostController.remove);

module.exports = router;
