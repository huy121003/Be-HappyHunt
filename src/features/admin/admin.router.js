const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const { authJwt } = require('../../middlewares');
router.post('/', authJwt.accessToken, adminController.create);
router.get('/', authJwt.accessToken, adminController.getAll);
router.get('/:id', authJwt.accessToken, adminController.getById);
router.patch('/:id', authJwt.accessToken, adminController.update);
router.delete('/:id', authJwt.accessToken, adminController.remove);
router.patch('/:id/banned', authJwt.accessToken, adminController.banned);

module.exports = router;
