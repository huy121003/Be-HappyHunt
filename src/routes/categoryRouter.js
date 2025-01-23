const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authMiddlewareAccessToken } = require('../middlewares/authMiddleware');

router.post('/', categoryController.createCategory);
router.get('/pagination', categoryController.fetchAllCategoriesWithPagination);
router.get('/', categoryController.fetchAllCategories);
router.get('/parent', categoryController.fetchCategoryParent);
router.get(
  '/:id',
  authMiddlewareAccessToken,
  categoryController.fetchCategoryById
);
router.patch(
  '/:id',
  authMiddlewareAccessToken,
  categoryController.updateCategory
);
router.delete(
  '/:id',
  authMiddlewareAccessToken,
  categoryController.deleteCategory
);
module.exports = router;
