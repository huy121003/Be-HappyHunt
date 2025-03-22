const { apiHandler, parseSortQuery } = require('../../helpers');
const categoryService = require('./category.service');

require('dotenv').config();

const create = async (req, res) => {
  try {
    const result = await categoryService.create({
      ...req.body,
      createdBy: req.userAccess._id,

      ...(req.files && { icon: req.files.icon }),
    });
    return apiHandler.sendCreated(res, 'Category created successfully', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getAll = async (req, res) => {
  try {
    const result = await categoryService.getAll(req.query);
    return apiHandler.sendSuccessWithData(res, 'List categories', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getAllPagination = async (req, res) => {
  try {
    const result = await categoryService.getAllPagination(req.query);
    return apiHandler.sendSuccessWithData(res, 'List categories', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getById = async (req, res) => {
  try {
    const result = await categoryService.getById(req.params.id);
    return apiHandler.sendSuccessWithData(res, 'Category', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const update = async (req, res) => {
  try {
    const result = await categoryService.update(req.params.id, {
      ...req.body,
      updatedBy: req.userAccess._id,
      ...(req.files && { icon: req.files.icon }),
    });
    return apiHandler.sendCreated(res, 'Category created successfully', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const remove = async (req, res) => {
  try {
    await categoryService.remove(req.params.id);
    return apiHandler.sendCreated(res, 'Category deleted successfully');
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const getAllParent = async (req, res) => {
  try {
    const result = await categoryService.getAllParent(req.query);
    return apiHandler.sendSuccessWithData(res, 'List categories', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  getAllParent,
  getAllPagination,
};
