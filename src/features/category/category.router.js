const express = require('express');
const categoryController = require('./category.controller');
const router = express.Router();
const { authJwt } = require('../../middlewares');
const categoryValidator = require('./category.validator');
router.post(
  '/',
  authJwt.accessToken,
  categoryValidator.createCategory,
  categoryController.createCategory
);
router.get('/pagination', categoryController.fetchAllCategoriesWithPagination);
router.get('/', categoryController.fetchAllCategories);
router.get('/parent', categoryController.fetchCategoryParent);
router.get(
  '/:id',
  authJwt.accessToken,
  categoryValidator.fetchCategoryById,
  categoryController.fetchCategoryById
);
router.patch(
  '/:id',
  authJwt.accessToken,
  categoryValidator.updateCategory,
  categoryController.updateCategory
);
router.delete(
  '/:id',
  authJwt.accessToken,
  categoryValidator.deleteCategory,
  categoryController.deleteCategory
);
module.exports = router;
