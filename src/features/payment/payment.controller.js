const paymentService = require('./payment.service');

const updatePaymentHistory = async (req, res) => {
  if (
    req.body.code === '00' &&
    req.body.desc === 'success' &&
    req.body.data.code === '00'
  ) {
    try {
      const result = await paymentService.updateStatus({
        status: 'PAID',
        orderCode: req.body.data.orderCode,
        paymentLinkId: req.body.data.paymentLinkId,
        qrcode: req.body.data.qrcode,
      });
      if (result) {
        console.log('Payment history updated successfully:', result);
      }
    } catch (error) {
      console.error('Error during create payment history:', error.message);
    }
  }
};
const updateStatus = async (req, res) => {
  try {
    const result = await paymentService.updateStatus(req.body);
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
    const result = await paymentService.checkStatus(req.body);
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
    const result = await paymentService.getAllPaginate(req.query);
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
    const result = await paymentService.getAllPaginate({
      ...req.query,
      createdBy: req.userAccess._id,
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
    const result = await paymentService.getDepositStatistics(req.params);
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
      return apiHandler.sendNotFound(res, 'Top depositors not found');
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
};
