const {
  sendSuccessWithData,
  sendErrorMessage,
  sendValidationError,
  sendSuccessMessage,
} = require('../helpers/apiHelper');
const { parseSortQuery } = require('../helpers/parseSortQuery');
const Category = require('../models/category');
const {
  createCategoryService,
  fetchAllCategoriesService,
  fetchAllCategoriesWithPaginationService,
  fetchCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
  fetchCategoryParentService,
} = require('../services/categoryService');
require('dotenv').config();
const createCategory = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return sendValidationError(res, 'Icon không được để trống');
  }
  const { nameVn, nameEn, description, attributes, url, parent } = req.body;
  if (!nameVn || !nameEn || !description || !attributes || !url) {
    return sendValidationError(res, 'Thông tin không được để trống');
  }
  try {
    const nameVnExist = await Category.findOne({ nameVn: nameVn });
    if (nameVnExist) {
      return sendValidationError(res, 'Tên danh mục tiếng việt đã tồn tại');
    }
    const nameEnExist = await Category.findOne({ nameEn: nameEn });
    if (nameEnExist) {
      return sendValidationError(res, 'Tên danh mục tiếng anh đã tồn tại');
    }
    const urlExist = await Category.findOne({
      url: url,
    });
    if (urlExist) {
      return sendValidationError(res, 'Url đã tồn tại');
    }

    const result = await createCategoryService({
      nameVn,
      nameEn,
      description,
      attributes,
      url,
      icon: req.files.icon,
      parent,
    });
    return sendSuccessWithData(res, 'Category created successfully', result);
  } catch (error) {
    return sendErrorMessage(res, error.message);
  }
};
const fetchAllCategories = async (req, res) => {
  let { sort, ...search } = req.query;

  const sortObject = parseSortQuery(sort);
  if (!search) {
    search = {};
  }
  try {
    const result = await fetchAllCategoriesService({
      sortObject,
      search,
    });
    return sendSuccessWithData(res, 'List categories', result);
  } catch (error) {
    return sendErrorMessage(res, error.message);
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
    const result = await fetchAllCategoriesWithPaginationService({
      pageNumber,
      pageSize,
      sortObject,
      search,
    });
    return sendSuccessWithData(res, 'List categories', result);
  } catch (error) {
    return sendErrorMessage(res, error.message);
  }
};
const fetchCategoryById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendValidationError(res, 'Id không được để trống');
  }
  try {
    const result = await fetchCategoryByIdService(id);
    return sendSuccessWithData(res, 'Category', result);
  } catch (error) {
    return sendErrorMessage(res, error.message);
  }
};
const updateCategory = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendValidationError(res, 'Id không được để trống');
  }

  const { nameVn, nameEn, description, attributes, url, icon, parent } =
    req.body;
  console.log('sss', icon);
  if (!icon && (!req.files || Object.keys(req.files).length === 0)) {
    return sendValidationError(res, 'Icon không được để trống');
  }
  if (!nameVn || !nameEn || !description || !attributes || !url) {
    return sendValidationError(res, 'Thông tin không được để trống');
  }
  try {
    const result = await updateCategoryService(id, {
      nameVn,
      nameEn,
      description,
      attributes,
      url,
      icon: req.files ? req.files.icon : icon,
      parent,
    });
    return sendSuccessWithData(res, 'Category created successfully', result);
  } catch (error) {
    return sendErrorMessage(res, error.message);
  }
};
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendValidationError(res, 'Id không được để trống');
  }
  try {
    await deleteCategoryService(id);
    return sendSuccessMessage(res, 'Xóa danh mục thành công');
  } catch (error) {
    return sendErrorMessage(res, error.message);
  }
};
const fetchCategoryParent = async (req, res) => {
  try {
    const result = await fetchCategoryParentService();
    return sendSuccessWithData(res, 'List categories', result);
  } catch (error) {
    return sendErrorMessage(res, error.message);
  }
};
module.exports = {
  createCategory,
  fetchAllCategories,
  fetchAllCategoriesWithPagination,
  fetchCategoryById,
  updateCategory,
  deleteCategory,
  fetchCategoryParent,
};
