
const Ward = require('../../models/ward');
const exportFilter = require('./ward.filter');
require('dotenv').config();
const getAll = async (data) => {
  const { page, size, sort, ...filter } = exportFilter(data);
  const [totalDocuments, result] = await Promise.all([
    Ward.countDocuments(filter),
    Ward.find(filter)
      .select('name _id codeName shortCodeName')
      .sort(sort)
      .limit(size)
      .skip(page * size)
      .populate('districtId provinceId createdBy', 'name _id ')
      .exec(),
  ]);
  if (!result || !totalDocuments) throw new Error('Fetch wards failed');
  return {
    documentList: result,
    totalDocuments,
    pageSize: size,
    pageNumber: page,
  };
};
const getById = async (id) => {
  const result = await Ward.findById(id)
    .lean()
    .select('name _id codeName shortCodeName')
    .populate('districtId provinceId', 'name _id')
    .exec();
  if (!result) throw new Error('Ward not found');
  return result;
};

const create = async (ward) => {
  const result = await Ward.create(ward);
  if (!result) throw new Error('Create ward failed');
  return result;
};

const update = async (id, ward) => {
  const result = await Ward.findByIdAndUpdate(id, ward, {
    new: true,
  }).exec();
  if (!result) throw new Error('Update ward failed');
  return result;
};

const remove = async (id) => {
  const result = await Ward.deleteById(id).exec();
  if (!result) throw new Error('Delete ward failed');
  return result;
};
module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
