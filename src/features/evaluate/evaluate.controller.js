const { apiHandler } = require('../../helpers');
const evaluateService = require('./evaluate.service');
const create = async (req, res) => {
  try {
    const result = await evaluateService.create({
      ...req.body,
      createdBy: req.userAccess._id,
    });
    return apiHandler.sendCreated(res, 'Account created successfully', result);
  } catch (error) {
    if (error.message.includes('create')) {
      return apiHandler.sendErrorMessage(
        res,
        'Failed to create evaluate account'
      );
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getByIdUser = async (req, res) => {
  try {
    const result = await evaluateService.getByIdUser(req.params.id, req.query);
    return apiHandler.sendSuccessWithData(res, 'Account', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Account not found');
    }
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
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Account not found');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getDetail = async (req, res) => {
  try {
    const result = await evaluateService.getDetail({
      ...req.query,
      createdBy: req.userAccess._id,
    });
    return apiHandler.sendSuccessWithData(res, 'Detail Evaluate', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendSuccessWithData(res, 'Evaluate not found', null);
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const countEvaluate = async (req, res) => {
  try {
    const result = await evaluateService.countEvaluate(req.params.id);
    return apiHandler.sendSuccessWithData(res, 'Count Evaluate', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
module.exports = {
  create,
  getByIdUser,
  countByUserId,
  getDetail,
  countEvaluate,
};
