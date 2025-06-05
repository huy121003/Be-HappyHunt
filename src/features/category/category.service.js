const autoSlug = require('../../helpers/autoSlug');
const { Category } = require('../../models');
const { uploadSingle } = require('../file/file.service');
const exportFilter = require('./category.filter');
require('dotenv').config();
const create = async (category) => {
  try {
    const iconUrl = category.icon ? await uploadSingle(category.icon) : null;
    const result = await Category.create({
      ...category,
      icon: iconUrl,
      attributes: category.attributes
        ? JSON.parse(category.attributes)
        : undefined,
      messages: category.messages ? JSON.parse(category.messages) : undefined,
      parent: category.parent ? category.parent : null,
      slug: autoSlug(category.name),
      keywords: category.keywords ? category.keywords : [],
    });

    if (!result) throw new Error('create');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllPagination = async (data) => {
  try {
    const { page, size, sort, ...filter } = exportFilter(data);

    const [totalDocuments, result] = await Promise.all([
      Category.countDocuments(filter),
      Category.find(filter)
        .select('name _id parent isPayment pricePayment')
        .sort(sort)
        .limit(size)
        .skip(page * size)
        .populate('parent', 'name _id')

        .exec(),
    ]);

    if (!result) throw new Error('notfound');

    return {
      documentList: result,
      totalDocuments,
      pageSize: size,
      pageNumber: page,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAll = async (data) => {
  try {
    const { page, size, sort, ...filter } = exportFilter(data);
    const result = await Category.find(filter)
      .select('name _id parent isPayment pricePayment slug')
      .populate('parent', 'name _id slug')
      .exec();
    if (!result) throw new Error('notfound');

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getById = async (id) => {
  try {
    const result = await Category.findById(id)
      .select('-createdAt -updatedAt -__v')
      .populate('parent', 'name _id slug icon')
      .exec();
    if (!result) throw new Error('notfound');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getBySlug = async (slug) => {
  try {
    const result = await Category.findOne({ slug })
      .select('-createdAt -updatedAt -__v')
      .populate('parent', 'name _id slug icon')
      .exec();
    if (!result) throw new Error('notfound');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const update = async (id, category) => {
  try {
    const iconUrl = category.icon ? await uploadSingle(category.icon) : null;
    const result = await Category.findByIdAndUpdate(
      id,
      {
        ...category,
        ...(iconUrl && { icon: iconUrl }),
        attributes: category.attributes
          ? JSON.parse(category.attributes)
          : undefined,
        messages: category.messages ? JSON.parse(category.messages) : undefined,
        parent: category.parent ? category.parent : null,
      },
      {
        new: true,
      }
    );
    if (!result) throw new Error('update');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const remove = async (id) => {
  try {
    const result = await Category.deleteById(id);
    if (!result) throw new Error('delete');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getAllParent = async (data) => {
  try {
    const { page, size, sort, ...filter } = exportFilter(data);
    const [totalDocuments, result] = await Promise.all([
      Category.countDocuments({
        ...filter,
        parent: null,
      }),
      Category.find({
        ...filter,
        parent: null,
      })
        .select('name _id parent icon slug')
        .limit(size)
        .skip(page * size)
        .populate('parent', 'name _id slug icon')

        .exec(),
    ]);
    if (!result) throw new Error('notfound');
    return {
      documentList: result,
      totalDocuments,
      pageSize: size,
      pageNumber: page,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
const getAllChild = async (id) => {
  try {
    const result = await Category.find({
      parent: id,
    })
      .select('name _id parent icon slug')
      .populate('parent', 'name _id slug icon')
      .exec();

    if (!result) throw new Error('notfound');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getKeyword = async (id) => {
  try {
    const result = await Category.findById(id).select('keywords name').exec();
    if (!result) throw new Error('notfound');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  create,
  getAllPagination,
  getAll,
  getById,
  update,
  remove,
  getAllParent,
  getBySlug,
  getAllChild,
  getKeyword,
};
