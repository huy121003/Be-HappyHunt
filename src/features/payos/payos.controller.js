const { apiHandler } = require('../../helpers');
const PaymentHistory = require('../../models/payment-history');

require('dotenv').config();
const payOSService = require('./payos.service');
const createPaymentLink = async (req, res) => {
  try {
    const count = await PaymentHistory.countDocuments({
      createdBy: Number(req.userAccess._id),
      status: 'PENDING',
    });
    // if (count >= 5) {
    //   throw new Error('count');
    // }
    const result = await payOSService.createPaymentLink({
      ...req.body,
    
      createdBy: req.userAccess._id,
    });
    if (res) {
      return apiHandler.sendSuccessWithData(
        res,
        'Payment link created successfully',
        result
      );
    }
  } catch (error) {
    if (error.message === 'create') {
      return apiHandler.sendErrorMessage(
        res,
        'Error during create payment link'
      );
    }
    if (error.message === 'count') {
      return apiHandler.sendValidationError(
        res,
        'You have more 5 bills waiting for payment, please pay first'
      );
    }

    return apiHandler.sendErrorMessage(res, error);
  }
};

const getPaymentLinkInformation = async (req, res) => {
  try {
    const result = await payOSService.getPaymentLinkInformation(req.params.id);

    return apiHandler.sendSuccessWithData(
      res,
      'Payment link information',
      result
    );
  } catch (error) {
    console.error('Error during get payment link information:', error);
    if (error.message === 'notfound') {
      return apiHandler.sendNotFound(res, 'Payment link not found');
    }
    return apiHandler.sendErrorMessage(res, error);
  }
};
const cancelPaymentLink = async (req, res) => {
  try {
    const result = await payOSService.cancelPaymentLink(req.params.id);
    return apiHandler.sendSuccessWithData(res, 'Payment link canceled', result);
  } catch (error) {
    console.error('Error during cancel payment link:', error);
    if (error.message === 'notfound') {
      return apiHandler.sendNotFound(res, 'Payment link not found');
    }
    return apiHandler.sendErrorMessage(res, error);
  }
};

module.exports = {
  createPaymentLink,
  getPaymentLinkInformation,
  cancelPaymentLink,
};
