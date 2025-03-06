const { Role } = require('../../models');
const exportFilter = require('./role.filter');

require('dotenv').config();
const getAll = async (data) => {
  const { page, size, sort, ...filter } = exportFilter(data);
  const [totalDocuments, result] = await Promise.all([
    Role.countDocuments(filter),
    Role.find(filter)
      .select('name _id description createdAt')
      .populate('createdBy', 'name _id')
      .sort(sort)
      .limit(size)
      .skip(page * size)
      .exec(),
  ]);
  if (!result || !totalDocuments) throw new Error('Fetch  role failed');
  return {
    documentList: result,
    totalDocuments,
    pageSize: size,
    pageNumber: page,
  };
};
const getById = async (id) => {
  const result = await Role.findById(id)
    .select('-__v -createdAt -updatedAt -deleted')
    .exec();
  if (!result) throw new Error('Role not found');
  return result;
};
const create = async (data) => {
  const result = await Role.create(data);
  if (!result) throw new Error('Role creation failed');
  return result;
};
const update = async (id, data) => {
  const result = await Role.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!result) throw new Error('Role update failed');
  return result;
};
const remove = async (id) => {
  const result = await Role.deleteById(id);
  if (!result) throw new Error('Role delete failed');
  return result;
};
module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
