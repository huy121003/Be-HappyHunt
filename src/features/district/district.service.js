const District = require('../../models/district');
const exportFilter = require('./district.filter');
require('dotenv').config();
const getAll = async (data) => {
  try {
    const { page, size, sort, ...filter } = exportFilter(data);
    const [totalDocuments, result] = await Promise.all([
      District.countDocuments(filter),
      District.find(filter)
        .select('name _id codeName shortCodeName createdAt updatedAt')
        .sort(sort)
        .limit(size)
        .skip(page * size)
        .populate('province createdBy updatedBy', 'name _id ')
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
    const result = await District.findById(id)
      .lean()
      .select('name _id codeName shortCodeName')
      .populate('province', 'name _id ')
      .exec();
    if (!result) throw new Error('notfound');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const create = async (district) => {
  try {
    const result = await District.create(district);
    if (!result) throw new Error('create');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const update = async (id, district) => {
  try {
    const result = await District.findByIdAndUpdate(id, district, {
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
    const result = await District.deleteById(id).exec();
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
