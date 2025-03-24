const express = require('express');
const router = express.Router();
const historyClickController = require('./historyClick.controller');
const { authJwt } = require('../../middlewares');

router.get('/:id', authJwt.accessToken, historyClickController.getAllByPostId);
router.get(
  '/:id/count-every-day',
  authJwt.accessToken,
  historyClickController.countClicksByDay
);

module.exports = router;
