const Province = require('../../models/province');
const exportFilter = require('./province.filter');
require('dotenv').config();
const create = async (province) => {
  const result = await Province.create(province);
  if (!result) throw new Error('Create province failed');

  return result;
};
const update = async (id, province) => {
  const result = await Province.findByIdAndUpdate(id, province, {
    new: true,
  });
  if (!result) throw new Error('Update province failed');

  return result;
};
const getAll = async (data) => {
  const { page, size, sort, ...filter } = exportFilter(data);
  const [totalDocuments, result] = await Promise.all([
    Province.countDocuments(filter),
    Province.find(filter)
      .select('name _id codeName phoneCode')
      .populate('createdBy', 'name _id')
      .sort(sort)
      .limit(size)
      .skip(page * size)
      .exec(),
  ]);

  if (!result || !totalDocuments) throw new Error('Fetch provinces failed');
  return {
    documentList: result,
    totalDocuments,
    pageSize: size,
    pageNumber: page,
  };
};
const getById = async (id) => {
  const result = await Province.findById(id)
    .select('name codeName phoneCode')
    .exec();
  if (!result) throw new Error('Province not found');
  return result;
};
const remove = async (id) => {
  const result = await Province.deleteById(id);
  if (!result) throw new Error('Delete province failed');
  return result;
};
module.exports = {
  create,
  update,
  getAll,
  getById,
  remove,
};
