const { Role } = require('../../models');
const exportFilter = require('./role.filter');

require('dotenv').config();
const getAll = async (data) => {
  try {
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
    const result = await Role.findById(id)
      .select('-__v -createdAt -updatedAt -deleted')
      .exec();
    if (!result) throw new Error('notfound');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const create = async (data) => {
  try {
    const result = await Role.create(data);
    if (!result) throw new Error('create');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const update = async (id, data) => {
  try {
    const result = await Role.findByIdAndUpdate(
      id,
      {
        ...data,
        $inc: { version: 1 },
      },
      {
        new: true,
      }
    );
    if (!result) throw new Error('create');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const remove = async (id) => {
  try {
    const result = await Role.deleteById(id);
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
