const express = require('express');
const paymentController = require('./payment.controller');
const router = express.Router();
const { authJwt } = require('../../middlewares');
router.get('/top5', paymentController.getTopDepositors);
router.get('/by-user', authJwt.accessToken, paymentController.getAllByUser);
router.get(
  '/pagination',
  authJwt.accessToken,
  paymentController.getAllPagiantion
);
router.get(
  '/statistic',
  authJwt.accessToken,
  paymentController.getDepositStatistics
);
router.patch(
  '/:id/update-status',
  authJwt.accessToken,
  paymentController.updateStatus
);
router.get('/:id', authJwt.accessToken, paymentController.getById);

router.post('/:id/status', authJwt.accessToken, paymentController.checkStatus);

module.exports = router;
