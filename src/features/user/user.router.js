const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { authJwt } = require('../../middlewares');
router.get('/', authJwt.accessToken, userController.getAll);
router.get('/:id', authJwt.accessToken, userController.getById);
router.delete('/:id', authJwt.accessToken, userController.remove);
router.patch('/:id/banned', authJwt.accessToken, userController.banned);

router.get('/slug/:slug', authJwt.accessToken, userController.getBySlug);

module.exports = router;
