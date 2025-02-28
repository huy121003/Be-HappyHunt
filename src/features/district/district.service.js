const parseFilterQuery = require('../../helpers/parseFilterQuery');
const District = require('../../models/district');
require('dotenv').config();
const getAll = async (data) => {
  const {
    page = process.env.PAGENUMBER_DEFAULT,
    size = process.env.PAGESIZE_DEFAULT,
    sort = process.env.SORT_DEFAULT,
    ...filter
  } = data;
  const [totalDocuments, result] = await Promise.all([
    District.countDocuments(parseFilterQuery(filter)),
    District.find({ ...parseFilterQuery(filter) })
      .select('name _id codeName')
      .sort(sort)
      .limit(size)
      .skip(page * size)
      .populate('provinceId', 'name _id codeName')
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
    .select('name _id codeName')
    .populate('provinceId', 'name _id codeName')
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
