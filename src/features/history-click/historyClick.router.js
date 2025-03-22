const express = require('express');
const router = express.Router();
const historyClickController = require('./historyClick.controller');
const { authJwt } = require('../../middlewares');

router.get('/:id', authJwt.accessToken, historyClickController.getAllByPostId);
router.post('/:id/count-every-day', historyClickController.countClicksByDay);

module.exports = router;
