const { Banner } = require('../../models');
const { uploadSingle } = require('../file/file.service');
const exportFilter = require('./banner.filter');
require('dotenv').config();
const create = async (banner) => {
  try {
    const imageUrl = banner.image ? await uploadSingle(banner.image) : null;
    const result = await Banner.create({
      ...banner,
      image: imageUrl,
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
      Banner.countDocuments(filter),
      Banner.find(filter)
        .select('name _id image isShow link  createdAt updatedAt ')
        .populate('createdBy updatedBy', 'name _id')
        .sort(sort)
        .limit(size)
        .skip(page * size)
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
    const result = await Banner.find(filter)
      .sort(sort)
      .select('name _id image isShow link')
      .exec();
    if (!result) throw new Error('notfound');

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getById = async (id) => {
  try {
    const result = await Banner.findById(id)
      .select('name image link description')
      .exec();
    if (!result) throw new Error('notfound');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const update = async (id, banner) => {
  try {
    const imageUrl = banner.image ? await uploadSingle(banner.image) : null;
    const result = await Banner.findByIdAndUpdate(
      id,
      {
        ...banner,
        ...(imageUrl && { image: imageUrl }),
      },
      {
        new: true,
      }
    ).exec();
    if (!result) throw new Error('update');

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const remove = async (id) => {
  try {
    const result = await Banner.findByIdAndDelete(id).exec();
    if (!result) throw new Error('delete');

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const show = async (id, data) => {
  try {
    const result = await Banner.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();
    if (!result) throw new Error('update');

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  show,
  getAllPagination,
};
