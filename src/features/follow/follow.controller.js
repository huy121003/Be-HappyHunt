const { apiHandler } = require('../../helpers');
const followService = require('./follow.service');
const create = async (req, res) => {
  try {
    const result = await followService.create({
      ...req.body,
      createdBy: req.userAccess._id,
    });
    return apiHandler.sendCreated(res, result);
  } catch (error) {
    if (error.message === 'create') {
      return apiHandler.sendErrorMessage(res, 'Create failed');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const remove = async (req, res) => {
  try {
    const result = await followService.remove({
      following: req.params.id,
      createdBy: req.userAccess._id,
    });
    return apiHandler.sendSuccessWithData(res, 'Delete success', result);
  } catch (error) {
    if (error.message === 'delete') {
      return apiHandler.sendErrorMessage(res, 'Delete failed');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const count = async (req, res) => {
  try {
    const result = await followService.count(req.params.id);
    return apiHandler.sendSuccessWithData(res, 'Count', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};

const getAllPagination = async (req, res) => {
  try {
    const result = await followService.getAllPagination({
      ...req.query,
      createdBy: req.params.id,
    });
    return apiHandler.sendSuccessWithData(res, 'Get all pagination', result);
  } catch (error) {
    if (error.message === 'notfound') {
      return apiHandler.sendErrorMessage(res, 'Not found');
    }
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getById = async (req, res) => {
  try {
    const result = await followService.getById(
      req.userAccess._id,
      req.params.id
    );
    return apiHandler.sendSuccessWithData(res, 'Get by id', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};

module.exports = {
  create,
  remove,
  count,
  getAllPagination,
  getById,
};
