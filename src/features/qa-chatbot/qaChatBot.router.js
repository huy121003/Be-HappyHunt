const express = require('express');
const qaChatbotController = require('./qaChatBot.controller');
const router = express.Router();

const { authJwt } = require('../../middlewares');

router.get('/', authJwt.accessToken, qaChatbotController.getAllPagination);
router.post('/', authJwt.accessToken, qaChatbotController.create);
router.post('/answer', authJwt.accessToken, qaChatbotController.getAnswer);

router.get('/:id', authJwt.accessToken, qaChatbotController.getById);
router.patch('/:id', authJwt.accessToken, qaChatbotController.update);
router.delete('/:id', authJwt.accessToken, qaChatbotController.remove);

module.exports = router;
