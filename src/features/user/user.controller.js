const userService = require('./user.service');
const { apiHandler } = require('../../helpers');

const getAll = async (req, res) => {
  try {
    const result = await userService.getAll(req.query);
    return apiHandler.sendSuccessWithData(res, 'List accounts', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'No accounts found');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getById = async (req, res) => {
  try {
    const result = await userService.getById(req.params.id);
    return apiHandler.sendSuccessWithData(res, 'Account', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Account not found');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getBySlug = async (req, res) => {
  try {
    const result = await userService.getBySlug(req.params.slug);
    return apiHandler.sendSuccessWithData(res, 'Account', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Account not found');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};

const remove = async (req, res) => {
  try {
    const result = await userService.remove(req.params.id);
    return apiHandler.sendCreated(res, 'Account removed successfully', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Account not found');
    }
    if (error.message.includes('delete')) {
      return apiHandler.sendConflict(res, 'Failed to remove account');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const banned = async (req, res) => {
  try {
    const result = await userService.banned(req.params.id, {
      isBanned: req.body.isBanned,
      updatedBy: req.userAccess._id,
    });
    return apiHandler.sendCreated(res, 'Account banned successfully', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Account not found');
    }
    if (error.message.includes('update')) {
      return apiHandler.sendConflict(res, 'Failed to banned account');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getNewAccountStatistics = async (req, res) => {
  try {
    const result = await userService.getNewAccountStatistics(req.query);
    return apiHandler.sendSuccessWithData(res, 'List accounts', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'No data in this time range');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
module.exports = {
  getAll,
  getById,
  remove,
  banned,
  getBySlug,
  getNewAccountStatistics,
};
