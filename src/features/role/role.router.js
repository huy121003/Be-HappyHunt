const express = require('express');
const router = express.Router();
const roleController = require('./role.controller');
const { authJwt } = require('../../middlewares');
router.get('/', authJwt.accessToken, roleController.getAll);
router.get('/:id', authJwt.accessToken, roleController.getById);
router.post('/', authJwt.accessToken, roleController.create);
router.patch('/:id', authJwt.accessToken, roleController.update);
router.delete('/:id', authJwt.accessToken, roleController.remove);

module.exports = router;
