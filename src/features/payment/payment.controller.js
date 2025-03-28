const { apiHandler } = require('../../helpers');
const paymentService = require('./payment.service');
const payosService = require('../payos/payos.service');
const updatePaymentHistory = async (req, res) => {
  try {
    const verify = await payosService.verifyPaymentWebhook(req.body);
    if (!verify) {
      return apiHandler.sendValidationError(
        res,
        'Error during verify payment webhook'
      );
    }
    const result = await paymentService.updatePaymentHistory({
      status: req.body.data.desc.toUpperCase(),

      orderCode: req.body.data.orderCode,
      paymentLinkId: req.body.data.paymentLinkId,
      amount: req.body.data.amount,
    });
    if (result) {
      console.log('Payment history updated successfully:', result);
    }
  } catch (error) {
    if (error.message === 'update') {
      console.error('Error during update payment history');
    }
    console.error('Error during create payment history:', error.message);
  }
};
const updateStatus = async (req, res) => {
  try {
    const result = await paymentService.updateStatus(req.params.id, req.body);
    return apiHandler.sendSuccessWithData(
      res,
      'Payment history updated successfully',
      result
    );
  } catch (error) {
    if (error.message === 'update') {
      return apiHandler.sendErrorMessage(
        res,
        'Error during update payment history'
      );
    }
    throw new Error(error.message);
  }
};
const checkStatus = async (req, res) => {
  try {
    const result = await paymentService.checkStatus(req.params.id);
    return apiHandler.sendSuccessWithData(res, 'Payment status', result);
  } catch (error) {
    if (error.message === 'notfound') {
      return apiHandler.sendErrorMessage(res, 'Payment history not found');
    }
    throw new Error(error.message);
  }
};
const getById = async (req, res) => {
  try {
    const result = await paymentService.getById(req.params.id);
    return apiHandler.sendSuccessWithData(res, 'Payment history', result);
  } catch (error) {
    if (error.message === 'notfound') {
      return apiHandler.sendNotFound(res, 'Payment history not found');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getAllPagiantion = async (req, res) => {
  try {
    const result = await paymentService.getAllPagiantion(req.query);
    return apiHandler.sendSuccessWithData(res, 'Payment history', result);
  } catch (error) {
    if (error.message === 'notfound') {
      return apiHandler.sendNotFound(res, 'Payment history not found');
    }
    throw new Error(error.message);
  }
};
const getAllByUser = async (req, res) => {
  try {
    const result = await paymentService.getAllPagiantion({
      ...req.query,
      createdBy: Number(req.userAccess._id),
    });
    return apiHandler.sendSuccessWithData(res, 'Payment history', result);
  } catch (error) {
    if (error.message === 'notfound') {
      return apiHandler.sendNotFound(res, 'Payment history not found');
    }
    throw new Error(error.message);
  }
};
const getDepositStatistics = async (req, res) => {
  try {
    const result = await paymentService.getDepositStatistics(req.query);
    return apiHandler.sendSuccessWithData(res, 'Deposit statistics', result);
  } catch (error) {
    if (error.message === 'notfound') {
      return apiHandler.sendNotFound(res, 'Deposit statistics not found');
    }
    throw new Error(error.message);
  }
};
const getTopDepositors = async (req, res) => {
  try {
    const result = await paymentService.getTopDepositors();
    return apiHandler.sendSuccessWithData(res, 'Top depositors', result);
  } catch (error) {
    if (error.message === 'notfound') {
      return apiHandler.sendNotFound(res, 'No data in this time range');
    }
    throw new Error(error.message);
  }
};
const remove = async (req, res) => {
  try {
    const result = await paymentService.remove(req.params.id);
    return apiHandler.sendCreated(
      res,
      'Payment history deleted successfully',
      result
    );
  } catch (error) {
    if (error.message === 'delete') {
      return apiHandler.sendErrorMessage(
        res,
        'Error during delete payment history'
      );
    }
    throw new Error(error.message);
  }
};
module.exports = {
  updatePaymentHistory,
  updateStatus,
  checkStatus,
  getById,
  getAllPagiantion,
  getDepositStatistics,
  getTopDepositors,
  getAllByUser,
  remove,
};
