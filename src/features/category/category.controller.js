const { not } = require('joi');
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
    if (error.message.includes('duplicate')) {
      return apiHandler.sendConflict(res, 'Category name already exists');
    }
    if (error.message.includes('create')) {
      return apiHandler.sendErrorMessage(res, 'Failed to create category');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred. Please try again later.'
    );
  }
};
const getAll = async (req, res) => {
  try {
    const result = await categoryService.getAll(req.query);
    return apiHandler.sendSuccessWithData(res, 'List categories', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'No categories found');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred. Please try again later.'
    );
  }
};
const getAllPagination = async (req, res) => {
  try {
    const result = await categoryService.getAllPagination(req.query);
    return apiHandler.sendSuccessWithData(res, 'List categories', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'No categories found');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred. Please try again later.'
    );
  }
};
const getById = async (req, res) => {
  try {
    const result = await categoryService.getById(req.params.id);
    return apiHandler.sendSuccessWithData(res, 'Category', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Category not found');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred. Please try again later.'
    );
  }
};
const getBySlug = async (req, res) => {
  try {
    const result = await categoryService.getBySlug(req.params.slug);
    return apiHandler.sendSuccessWithData(res, 'Category', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Category not found');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred. Please try again later.'
    );
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
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Category not found');
    }
    if (error.message.includes('update')) {
      return apiHandler.sendErrorMessage(res, 'Failed to update category');
    }
    if (error.message.includes('duplicate')) {
      return apiHandler.sendConflict(res, 'Category name already exists');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred. Please try again later.'
    );
  }
};
const remove = async (req, res) => {
  try {
    await categoryService.remove(req.params.id);
    return apiHandler.sendCreated(res, 'Category deleted successfully');
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'Category not found');
    }
    if (error.message.includes('delete')) {
      return apiHandler.sendErrorMessage(res, 'Failed to delete category');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred. Please try again later.'
    );
  }
};
const getAllParent = async (req, res) => {
  try {
    const result = await categoryService.getAllParent(req.query);
    return apiHandler.sendSuccessWithData(res, 'List categories', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'No categories found');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred. Please try again later.'
    );
  }
};
const getAllChild = async (req, res) => {
  try {
    const result = await categoryService.getAllChild(req.params.id);
    return apiHandler.sendSuccessWithData(res, 'List categories', result);
  } catch (error) {
    if (error.message.includes('notfound')) {
      return apiHandler.sendNotFound(res, 'No categories found');
    }
    return apiHandler.sendErrorMessage(
      res,
      'An unexpected error occurred. Please try again later.'
    );
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
  getBySlug,
  getAllChild,
};
