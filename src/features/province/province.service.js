const parseFilterQuery = require('../../helpers/parseFilterQuery');
const Province = require('../../models/province');
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
  const {
    pageNumber = process.env.PAGENUMBER_DEFAULT,
    pageSize = process.env.PAGESIZE_DEFAULT,
    sort = process.env.SORT_DEFAULT,
    ...filter
  } = data;
  console.log('filter', data);
  const [totalDocuments, result] = await Promise.all([
    Province.countDocuments(parseFilterQuery(filter)),
    Province.find(parseFilterQuery(filter))
      .select('name _id codeName')
      .sort(sort)
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .exec(),
  ]);

  if (!result || !totalDocuments) throw new Error('Fetch provinces failed');
  return {
    documentList: result,
    totalDocuments,
    pageSize: data.pageSize,
    pageNumber: data.pageNumber,
  };
};
const getById = async (id) => {
  const result = await Province.findById(id).select('name _id codeName').exec();
  if (!result) throw new Error('Province not found');
  return result;
};
const remove = async (id) => {
  const result = await Province.deleteById(id).exec();
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
