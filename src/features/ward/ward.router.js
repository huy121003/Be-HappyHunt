const express = require('express');
const wardController = require('./ward.controller');
const router = express.Router();
const { authJwt } = require('../../middlewares');

router.post('/', authJwt.accessToken, wardController.create);
router.get('/', authJwt.accessToken, wardController.getAll);
router.get('/:id', authJwt.accessToken, wardController.getById);
router.patch('/:id', authJwt.accessToken, wardController.update);
router.delete('/:id', authJwt.accessToken, wardController.remove);

module.exports = router;
