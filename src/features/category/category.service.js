const { Category } = require('../../models');
const { uploadSingle } = require('../file/file.service');

const createCategory = async (category) => {
  const iconUrl = await uploadSingle(category.icon);
  if (!iconUrl) {
    throw new Error('Icon upload failed');
  }

  let attributes = JSON.parse(category.attributes);
  let parent = category.parent;
  if (category.parent === 'null') {
    parent = null;
  }
  console.log(category);
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
const fetchAllCategoriesWithPagination = async (filters) => {
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
const fetchAllCategories = async (filters) => {
  const { sortObject, search } = filters;

  const result = await Category.find(search).sort(sortObject);
  return result;
};
const fetchCategoryById = async (id) => {
  const result = await Category.findById(id);
  return result;
};
const updateCategory = async (id, category) => {
  let iconUrl;
  let attributes = JSON.parse(category.attributes);
  if (category.icon && typeof category.icon !== 'string') {
    iconUrl = await uploadSingle(category.icon);
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
  console.log(iconUrl);

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
  const result = await Category.findByIdAndUpdate(id, categoryData, {
    new: true,
  });
  return result;
};
const deleteCategory = async (id) => {
  const result = await Category.deleteById(id);
  return result;
};
const fetchCategoryParent = async () => {
  const result = await Category.find({ parent: null });
  if (!result) {
    throw new Error('Fetch parent category failed');
  }
  return result;
};

module.exports = {
  createCategory,
  fetchAllCategoriesWithPagination,
  fetchAllCategories,
  fetchCategoryById,
  updateCategory,
  deleteCategory,
  fetchCategoryParent,
};
