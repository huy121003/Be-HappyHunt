const express = require('express');
const router = express.Router();
const evaluateController = require('./evaluate.controller');

const { authJwt } = require('../../middlewares');

router.post('/', authJwt.accessToken, evaluateController.create);
router.get('/detail', authJwt.accessToken, evaluateController.getDetail);
router.get(
  '/countEvaluate/:id',
  authJwt.accessToken,
  evaluateController.countEvaluate
);
router.get('/:id', authJwt.accessToken, evaluateController.getByIdUser);
router.get('/count/:id', authJwt.accessToken, evaluateController.countByUserId);

module.exports = router;
