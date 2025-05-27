const express = require('express');
const router = express.Router();
const sampleMessageController = require('./sampleMessage.controller');
const { authJwt } = require('../../middlewares');

router.post('/', authJwt.accessToken, sampleMessageController.create);

router.get('/', authJwt.accessToken, sampleMessageController.getAll);
router.patch('/:id', authJwt.accessToken, sampleMessageController.update);
router.delete('/:id', authJwt.accessToken, sampleMessageController.remove);
router.get('/:id', authJwt.accessToken, sampleMessageController.getById);

module.exports = router;
