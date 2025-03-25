const express = require('express');
const categoryController = require('./category.controller');
const router = express.Router();
const { authJwt } = require('../../middlewares');
router.post('/', authJwt.accessToken, categoryController.create);
router.get(
  '/pagination',
  authJwt.accessToken,
  categoryController.getAllPagination
);
router.get('/', authJwt.accessToken, categoryController.getAll);
router.get('/parent', authJwt.accessToken, categoryController.getAllParent);
router.get('/child/:id', authJwt.accessToken, categoryController.getAllChild);
router.get('/:id', authJwt.accessToken, categoryController.getById);
router.get('/slug/:slug', authJwt.accessToken, categoryController.getBySlug);
router.patch('/:id', authJwt.accessToken, categoryController.update);
router.delete('/:id', authJwt.accessToken, categoryController.remove);
module.exports = router;
