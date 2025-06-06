const Ward = require('../../models/ward');
const exportFilter = require('./ward.filter');
require('dotenv').config();
const getAll = async (data) => {
  try {
    const { page, size, sort, ...filter } = exportFilter(data);
    const [totalDocuments, result] = await Promise.all([
      Ward.countDocuments(filter),
      Ward.find(filter)
        .select('name _id codeName shortCodeName createdAt updatedAt')
        .sort(sort)
        .limit(size)
        .skip(page * size)
        .populate('district province createdBy updatedBy', 'name _id ')
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
    const result = await Ward.findById(id)
      .lean()
      .select('name _id codeName shortCodeName')
      .populate('district province', 'name _id')
      .exec();
    if (!result) throw new Error('notfound');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const create = async (ward) => {
  try {
    const result = await Ward.create(ward);
    if (!result) throw new Error('create');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const update = async (id, ward) => {
  try {
    const result = await Ward.findByIdAndUpdate(id, ward, {
      new: true,
    }).exec();
    if (!result) throw new Error('update');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const remove = async (id) => {
  try {
    const result = await Ward.deleteById(id).exec();
    if (!result) throw new Error('delete');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
