const express = require('express');

const bannerController = require('./banner.controller');
const router = express.Router();
const { authJwt } = require('../../middlewares');
router.post('/', authJwt.accessToken, bannerController.create);
router.get('/pagination', bannerController.getAllPagination);
router.get('/', bannerController.getAll);
router.get('/:id', authJwt.accessToken, bannerController.getById);
router.patch('/:id', authJwt.accessToken, bannerController.update);
router.delete('/:id', authJwt.accessToken, bannerController.remove);
router.patch('/:id/show', authJwt.accessToken, bannerController.show);
module.exports = router;
