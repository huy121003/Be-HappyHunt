const { apiHandler, parseSortQuery } = require('../../helpers');
const { Category } = require('../../models');
const categoryService = require('./category.service');

require('dotenv').config();

const createCategory = async (req, res) => {
  const { nameVn, nameEn, description, attributes, url, parent } = req.body;

  try {
    const nameVnExist = await Category.findOne({ nameVn });
    if (nameVnExist) {
      return apiHandler.sendValidationError(
        res,
        'Tên danh mục tiếng việt đã tồn tại'
      );
    }
    const nameEnExist = await Category.findOne({ nameEn });
    if (nameEnExist) {
      return apiHandler.sendValidationError(
        res,
        'Tên danh mục tiếng anh đã tồn tại'
      );
    }
    const urlExist = await Category.findOne({
      url: url,
    });
    if (urlExist) {
      return apiHandler.sendValidationError(res, 'Url đã tồn tại');
    }

    const result = await categoryService.createCategory({
      nameVn,
      nameEn,
      description,
      attributes,
      url,
      icon: req.files.icon,
      parent,
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
  let { sort, ...search } = req.query;

  const sortObject = parseSortQuery(sort);
  if (!search) {
    search = {};
  }
  try {
    const result = await categoryService.fetchAllCategories({
      sortObject,
      search,
    });
    return apiHandler.sendSuccessWithData(res, 'List categories', result);
  } catch (error) {
    return apiHandler.sendErrorMessage(res, error.message);
  }
};
const fetchAllCategoriesWithPagination = async (req, res) => {
  let { pageNumber, pageSize, sort, ...search } = req.query;
  if (!pageNumber || pageNumber < 1) {
    pageNumber = process.env.PAGENUMBER_DEFAULT;
  }
  if (!pageSize || pageSize < 1) {
    pageSize = process.env.PAGESIZE_DEFAULT;
  }
  if (!sort) {
    sort = process.env.SORT_DEFAULT;
  }
  console.log('sort', sort);
  const sortObject = parseSortQuery(sort);
  if (!search) {
    search = {};
  }
  try {
    const result = await categoryService.fetchAllCategoriesWithPagination({
      pageNumber,
      pageSize,
      sortObject,
      search,
    });
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
  try {
    const result = await categoryService.fetchCategoryParent();
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
