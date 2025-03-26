const express = require('express');
const paymentController = require('./payment.controller');
const router = express.Router();
const { authJwt } = require('../../middlewares');
router.get('/by-user', authJwt.accessToken, paymentController.getAllByUser);
router.patch(
  '/:id/update-status',
  authJwt.accessToken,
  paymentController.updateStatus
);
router.get('/:id', authJwt.accessToken, paymentController.getById);
router.get(
  '/pagination',
  authJwt.accessToken,
  paymentController.getAllPagiantion
);

router.post('/:id/status', authJwt.accessToken, paymentController.checkStatus);
router.get(
  '/statistic',
  authJwt.accessToken,
  paymentController.getDepositStatistics
);
router.get('/top-5', authJwt.accessToken, paymentController.getTopDepositors);
module.exports = router;
