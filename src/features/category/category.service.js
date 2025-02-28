const parseFilterQuery = require('../../helpers/parseFilterQuery');
const { Category } = require('../../models');
const { uploadSingle } = require('../file/file.service');
require('dotenv').config();
const create = async (category) => {
  const iconUrl = category.icon ? await uploadSingle(category.icon) : null;
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

const getAllPagination = async (data) => {
  const {
    page = process.env.PAGENUMBER_DEFAULT,
    size = process.env.PAGESIZE_DEFAULT,
    sort = process.env.SORT_DEFAULT,
    ...filter
  } = data;

  const [totalDocuments, result] = await Promise.all([
    Category.countDocuments(parseFilterQuery(filter)),
    Category.find(parseFilterQuery(filter))
      .select('name _id parent')
      .sort(sort)
      .limit(size)
      .skip(page * size)
      .populate('parent', 'name _id')

      .exec(),
  ]);

  if (!result || !totalDocuments) throw new Error('Fetch  category failed');

  return {
    documentList: result,
    totalDocuments,
    pageSize: size,
    pageNumber: page,
  };
};

const getAll = async (data) => {
  const result = await Category.find(parseFilterQuery(data))
    .select('name _id parent')
    .populate('parent', 'name _id')
    .exec();
  if (!result) throw new Error('Fetch categories failed');

  return result;
};
const getById = async (id) => {
  const result = await Category.findById(id)
    .select('-createdAt -updatedAt -__v')
    .populate('parent', 'name _id')
    .exec();
  if (!result) throw new Error('Category not found');
  return result;
};
const update = async (id, category) => {
  const iconUrl = category.icon ? await uploadSingle(category.icon) : null;
  const result = await Category.findByIdAndUpdate(
    id,
    {
      ...category,
      ...(iconUrl && { icon: iconUrl }),
      attributes: category.attributes
        ? JSON.parse(category.attributes)
        : undefined,
      parent: category.parent ? category.parent : null,
    },
    {
      new: true,
    }
  );
  if (!result) throw new Error('Category creation failed');
  return result;
};
const remove = async (id) => {
  const result = await Category.deleteById(id);
  if (!result) throw new Error('Delete category failed');
  return result;
};
const getAllParent = async (data) => {
  const {
    page = process.env.PAGENUMBER_DEFAULT,
    size = process.env.PAGESIZE_DEFAULT,
    sort = process.env.SORT_DEFAULT,
    ...filter
  } = data;
  const [totalDocuments, result] = await Promise.all([
    Category.countDocuments(parseFilterQuery(filter)),
    Category.find(parseFilterQuery(filter))
      .select('name _id parent')
      .limit(size)
      .skip(page * size)
      .populate('parent', 'name _id')

      .exec(),
  ]);
  if (!result) throw new Error('Fetch parent category failed');
  if (!totalDocuments) throw new Error('Fetch total documents failed');
  return {
    documentList: result,
    totalDocuments,
    pageSize: size,
    pageNumber: page,
  };
};

module.exports = {
  create,
  getAllPagination,
  getAll,
  getById,
  update,
  remove,
  getAllParent,
};
