const express = require('express');
const categoryController = require('./category.controller');
const categoryValidator = require('./category.validator');
const router = express.Router();
const { authJwt } = require('../../middlewares');
router.post('/', authJwt.accessToken, categoryController.create);
router.get('/pagination', categoryController.getAllPagination);
router.get('/', categoryController.getAll);
router.get('/parent', categoryController.getAllParent);
router.get(
  '/:id',
  authJwt.accessToken,
  categoryValidator.getById,
  categoryController.getById
);
router.patch(
  '/:id',
  authJwt.accessToken,
  categoryValidator.update,
  categoryController.update
);
router.delete(
  '/:id',
  authJwt.accessToken,
  categoryValidator.remove,
  categoryController.remove
);
module.exports = router;
