const { apiHandler, parseSortQuery } = require('../../helpers');
const { Category } = require('../../models');
const categoryService = require('./category.service');

require('dotenv').config();

const createCategory = async (req, res) => {
  console.log(req.body);
  try {
    const nameExist = await Category.findOne({ name: req.body.name });
    if (nameExist) {
      return apiHandler.sendValidationError(
        res,
        'Category name already exists'
      );
    }
    const urlExist = await Category.findOne({
      url: req.body.url,
    });
    if (urlExist) {
      return apiHandler.sendValidationError(res, 'Category url already exists');
    }
    const result = await categoryService.createCategory({
      ...req.body,
      ...(req.files && { icon: req.files.icon }),
    });
    return apiHandler.sendSuccessWithData(
      res,
      'Category created successfully',
      result
    );
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const fetchAllCategories = async (req, res) => {
  try {
    const result = await categoryService.fetchAllCategories(req.query);
    return apiHandler.sendSuccessWithData(res, 'List categories', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const fetchAllCategoriesWithPagination = async (req, res) => {
  console.log('đ,', req.query);
  try {
    const result = await categoryService.fetchAllCategoriesWithPagination(
      req.query
    );
    return apiHandler.sendSuccessWithData(res, 'List categories', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const fetchCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await categoryService.fetchCategoryById(id);
    return apiHandler.sendSuccessWithData(res, 'Category', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const updateCategory = async (req, res) => {
  const { id } = req.params;

  const { nameVn, nameEn, description, attributes, url, icon, parent } =
    req.body;

  try {
    const result = await categoryService.updateCategory(id, {
      nameVn,
      nameEn,
      description,
      attributes,
      url,
      icon: req.files ? req.files.icon : icon,
      parent,
    });
    return apiHandler.sendSuccessWithData(
      res,
      'Category created successfully',
      result
    );
  } catch (error) {
    console.log(error);
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await categoryService.deleteCategory(id);
    return apiHandler.sendSuccessMessage(res, 'Xóa danh mục thành công');
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const fetchCategoryParent = async (req, res) => {
  console.log('đ,', req.query);
  try {
    const result = await categoryService.fetchCategoryParent(req.query);
    return apiHandler.sendSuccessWithData(res, 'List categories', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};

module.exports = {
  fetchAllCategories,
  fetchAllCategoriesWithPagination,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchCategoryParent,
};
