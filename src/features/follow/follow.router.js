const express = require('express');
const router = express.Router();
const { authJwt } = require('../../middlewares');
const followController = require('./follow.controller');

router.post('/', authJwt.accessToken, followController.create);
router.get('/count/:id', authJwt.accessToken, followController.count);
router.get(
  '/pagination/:id',
  authJwt.accessToken,
  followController.getAllPagination
);
router.get('/:id', authJwt.accessToken, followController.getById);
router.delete('/:id', authJwt.accessToken, followController.remove);

module.exports = router;
