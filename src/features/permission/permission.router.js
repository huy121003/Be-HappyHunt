const express = require('express');
const permissionController = require('./permission.controller');
const router = express.Router();

const { authJwt } = require('../../middlewares');

router.get('/', authJwt.accessToken, permissionController.getAll);
router.get('/:id', authJwt.accessToken, permissionController.getById);
router.post('/', authJwt.accessToken, permissionController.create);
router.patch('/:id', authJwt.accessToken, permissionController.update);
router.delete('/:id', authJwt.accessToken, permissionController.remove);
router.get(
  '/pagination',
  authJwt.accessToken,
  permissionController.getAllPagination
);

module.exports = router;
