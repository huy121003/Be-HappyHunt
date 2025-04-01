const express = require('express');
const searchController = require('./search.controller');
const router = express.Router();
const { authJwt } = require('../../middlewares');

router.get(
  '/pagination',
  authJwt.accessToken,
  searchController.getAllPagination
);
router.post('/', authJwt.accessToken, searchController.create);
router.delete('/:id', authJwt.accessToken, searchController.remove);
module.exports = router;
