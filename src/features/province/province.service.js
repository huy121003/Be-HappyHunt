const Province = require('../../models/province');
const exportFilter = require('./province.filter');
require('dotenv').config();
const create = async (province) => {
  try {
    const result = await Province.create(province);
    if (!result) throw new Error('create');

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const update = async (id, province) => {
  try {
    const result = await Province.findByIdAndUpdate(id, province, {
      new: true,
    });
    if (!result) throw new Error('update');

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getAll = async (data) => {
  try {
    const { page, size, sort, ...filter } = exportFilter(data);
    const [totalDocuments, result] = await Promise.all([
      Province.countDocuments(filter),
      Province.find(filter)
        .select('name _id codeName phoneCode createdAt updatedAt ')
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
const getById = async (id) => {
  try {
    const result = await Province.findById(id)
      .select('name codeName phoneCode')
      .exec();
    if (!result) throw new Error('notfound');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const remove = async (id) => {
  try {
    const result = await Province.deleteById(id);
    if (!result) throw new Error('delete');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  create,
  update,
  getAll,
  getById,
  remove,
};
