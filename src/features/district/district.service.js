const District = require('../../models/district');
const exportFilter = require('./district.filter');
require('dotenv').config();
const getAll = async (data) => {
  const { page, size, sort, ...filter } = exportFilter(data);
  const [totalDocuments, result] = await Promise.all([
    District.countDocuments(filter),
    District.find(filter)
      .select('name _id codeName shortCodeName createdAt')
      .sort(sort)
      .limit(size)
      .skip(page * size)
      .populate('province createdBy', 'name _id ')
      .exec(),
  ]);
  if (!result || !totalDocuments) throw new Error('Fetch districts failed');
  return {
    documentList: result,
    totalDocuments,
    pageSize: size,
    pageNumber: page,
  };
};
const getById = async (id) => {
  const result = await District.findById(id)
    .lean()
    .select('name _id codeName shortCodeName')
    .populate('province', 'name _id ')
    .exec();
  if (!result) throw new Error('District not found');
  return result;
};
const create = async (district) => {
  const result = await District.create(district);
  if (!result) throw new Error('Create district failed');
  return result;
};
const update = async (id, district) => {
  const result = await District.findByIdAndUpdate(id, district, {
    new: true,
  }).exec();
  if (!result) throw new Error('Update district failed');
  return result;
};
const remove = async (id) => {
  const result = await District.deleteById(id).exec();
  if (!result) throw new Error('Delete district failed');
  return result;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
