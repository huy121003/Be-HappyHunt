const { apiHandler } = require('../../helpers');

require('dotenv').config();
const payOSService = require('./payos.service');
const createPaymentLink = async (req, res) => {
  try {
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

    return apiHandler.sendErrorMessage(res, error);
  }
};

module.exports = {
  createPaymentLink,
};
