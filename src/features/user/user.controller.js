const userService = require('./user.service');
const { apiHandler } = require('../../helpers');

const getAll = async (req, res) => {
  try {
    const result = await userService.getAll(req.query);
    console.log(req.query);
    return apiHandler.sendSuccessWithData(res, 'List accounts', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getById = async (req, res) => {
  try {
    const result = await userService.getById(req.params.id);
    return apiHandler.sendSuccessWithData(res, 'Account', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};

const remove = async (req, res) => {
  try {
    const result = await userService.remove(req.params.id);
    return apiHandler.sendCreated(res, 'Account removed successfully', result);
  } catch (error) {
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
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
module.exports = {
  getAll,
  getById,
  remove,
  banned,
};
