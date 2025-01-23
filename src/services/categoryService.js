const Category = require('../models/category');
const { uploadSingleService } = require('./fileService');

const createCategoryService = async (category) => {
  const iconUrl = await uploadSingleService(category.icon);
  if (!iconUrl) {
    throw new Error('Icon upload failed');
  }

  let attributes = JSON.parse(category.attributes);
  let parent = category.parent;
  if (category.parent === 'null') {
    parent = null;
  }

  const categoryData = {
    nameVn: category.nameVn,
    nameEn: category.nameEn,
    description: category.description,
    attributes: attributes,
    url: category.url,
    icon: iconUrl,
    parent: parent,
  };
  console.log(categoryData);
  const result = await Category.create(categoryData);
  if (!result) {
    throw new Error('Category creation failed');
  }
  return result;
};
const fetchAllCategoriesWithPaginationService = async (filters) => {
  const { pageNumber, pageSize, sortObject, search } = filters;
  const totalDocuments = await Category.find(search).countDocuments();
  const skip = (pageNumber - 1) * pageSize;
  const limit = pageSize;

  const result = await Category.find(search)
    .skip(skip)
    .limit(limit)
    .sort(sortObject);
  return {
    result,
    totalDocuments,
    pageSize,
    pageNumber,
  };
};
const fetchAllCategoriesService = async (filters) => {
  const { sortObject, search } = filters;

  const result = await Category.find(search).sort(sortObject);
  return result;
};
const fetchCategoryByIdService = async (id) => {
  const result = await Category.findById(id);
  return result;
};
const updateCategoryService = async (id, category) => {
  let iconUrl;
  let attributes = JSON.parse(category.attributes);
  if (category.icon && typeof category.icon !== 'string') {
    iconUrl = await uploadSingleService(category.icon);
  } else {
    // Nếu icon là URL, sử dụng trực tiếp
    iconUrl = category.icon;
  }
  if (!iconUrl) {
    throw new Error('Icon upload failed');
  }
  let parent = category.parent;
  if (category.parent === 'null') {
    parent = null;
  }

  const categoryData = {
    nameVn: category.nameVn,
    nameEn: category.nameEn,
    description: category.description,
    attributes: attributes,
    url: category.url,
    icon: iconUrl,
    parent: parent,
  };
  const result = await Category.findByIdAndUpdate(id, categoryData, {
    new: true,
  });
  return result;
};
const deleteCategoryService = async (id) => {
  const result = await Category.deleteById(id);
  return result;
};
const fetchCategoryParentService = async () => {
  const result = await Category.find({ parent: null });
  if (!result) {
    throw new Error('Fetch parent category failed');
  }
  return result;
};
module.exports = {
  createCategoryService,
  fetchAllCategoriesService,
  fetchAllCategoriesWithPaginationService,
  fetchCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
  fetchCategoryParentService,
};
