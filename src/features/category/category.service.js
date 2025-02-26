const parseFilterQuery = require('../../helpers/parseFilterQuery');
const { Category } = require('../../models');
const { uploadSingle } = require('../file/file.service');
require('dotenv').config();
const createCategory = async (category) => {
  const iconUrl = category.icon ? await uploadSingle(category.icon) : null;
  if (category.icon && !iconUrl) throw new Error('Category icon upload failed');

  const result = await Category.create({
    ...category,
    icon: iconUrl,
    attributes: category.attributes
      ? JSON.parse(category.attributes)
      : undefined,
    parent: category.parent ? category.parent : null,
  });

  if (!result) throw new Error('Category creation failed');
  return result;
};

const fetchAllCategoriesWithPagination = async (data) => {
  const {
    pageNumber = process.env.PAGENUMBER_DEFAULT,
    pageSize = process.env.PAGESIZE_DEFAULT,
    sort = process.env.SORT_DEFAULT,
    ...filter
  } = data;

  const [totalDocuments, result] = await Promise.all([
    Category.countDocuments(parseFilterQuery(filter)),
    Category.find(parseFilterQuery(filter))
      .select('name _id parent')
      .sort(sort)
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .populate('parent', 'name _id')

      .exec(),
  ]);

  if (!result || !totalDocuments) throw new Error('Fetch  category failed');

  return {
    documentList: result,
    totalDocuments,
    pageSize: data.pageSize,
    pageNumber: data.pageNumber,
  };
};

const fetchAllCategories = async (data) => {
  const result = await Category.find(parseFilterQuery(data))
    .select('name _id parent')
    .populate('parent', 'name _id')
    .exec();
  if (!result) throw new Error('Fetch categories failed');

  return result;
};
const fetchCategoryById = async (id) => {
  const result = await Category.findById(id);
  return result;
};
const updateCategory = async (id, category) => {
  let iconUrl;
  let attributes = JSON.parse(category.attributes);
  if (category.icon && typeof category.icon !== 'string')
    iconUrl = await uploadSingle(category.icon);
  else iconUrl = category.icon;

  if (!iconUrl) throw new Error('Icon upload failed');

  let parent = category.parent;
  if (category.parent === 'null') parent = null;

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
  if (!result) throw new Error('Delete category failed');

  return result;
};
const fetchCategoryParent = async (data) => {
  const { pageNumber, pageSize, ...filter } = data;

  const [totalDocuments, result] = await Promise.all([
    Category.countDocuments(parseFilterQuery(filter)),

    Category.find(parseFilterQuery(filter))
      .select('name _id parent')
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .populate('parent', 'name _id')

      .exec(),
  ]);

  if (!result) throw new Error('Fetch parent category failed');

  if (!totalDocuments) throw new Error('Fetch total documents failed');

  return {
    documentList: result,
    totalDocuments,
    pageSize: data.pageSize,
    pageNumber: data.pageNumber,
  };
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
