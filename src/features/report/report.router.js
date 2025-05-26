const express = require('express');
const router = express.Router();
const reportController = require('./report.controller');
const { authJwt } = require('../../middlewares');

router.post('/', authJwt.accessToken, reportController.create);
router.get('/', authJwt.accessToken, reportController.getAll);
router.get('/:id', authJwt.accessToken, reportController.getById);
router.patch('/:id/status', authJwt.accessToken, reportController.updateStatus);
router.delete('/:id', authJwt.accessToken, reportController.remove);

module.exports = router;