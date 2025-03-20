const { apiHandler } = require('../../helpers');
const evaluateService = require('./evaluate.service');
const create = async (req, res) => {
  try {
    const result = await evaluateService.create(req.body);
    return apiHandler.sendCreated(res, 'Account created successfully', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getByIdUser = async (req, res) => {
  try {
    const result = await evaluateService.getByIdUser(req.params.id, req.query);
    return apiHandler.sendSuccessWithData(res, 'Account', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};

const countByUserId = async (req, res) => {
  try {
    const result = await evaluateService.countByUserId(req.params.id);
    return apiHandler.sendSuccessWithData(
      res,
      'Count Status successfully',
      result
    );
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
module.exports = {
  create,
  getByIdUser,
  countByUserId,
};
