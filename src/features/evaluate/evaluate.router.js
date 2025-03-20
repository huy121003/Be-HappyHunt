const express = require('express');
const router = express.Router();
const evaluateController = require('./evaluate.controller');

const { authJwt } = require('../../middlewares');

router.post('/', authJwt.accessToken, evaluateController.create);
router.get('/:id', authJwt.accessToken, evaluateController.getByIdUser);
router.get('/count/:id', authJwt.accessToken, evaluateController.countByUserId);
module.exports = router;
