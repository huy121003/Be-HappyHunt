const { Permission } = require('../../models');
const exportFilter = require('./permission.filter');

const getAll = async (data) => {
  try {
    const { page, size, sort, ...filter } = exportFilter(data);
    const result = Permission.find(filter)
      .select('-__v -createdAt -updatedAt -deleted')
      .exec();
    if (!result) throw new Error('notfound');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getAllPagination = async (data) => {
  try {
    const { page, size, sort, ...filter } = exportFilter(data);

    const [totalDocuments, result] = await Promise.all([
      Permission.countDocuments(filter),
      Permission.find(filter)
        .select('name _id description codeName')
        .sort(sort)
        .limit(size)
        .skip(page * size)
        .exec(),
    ]);

    if (!result ) throw new Error('notfound');

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
    const result = await Permission.findById(id)
      .select('-__v -createdAt -updatedAt -deleted')
      .populate('createdBy', 'name _id')
      .exec();
    if (!result) throw new Error('notfound');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const create = async (data) => {
  try {
    const result = await Permission.create(data);
    if (!result) throw new Error('create');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const update = async (id, data) => {
  try {
    const result = await Permission.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!result) throw new Error('update');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const remove = async (id) => {
  try {
    const result = await Permission.deleteById(id);
    if (!result) throw new Error('delete');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getAll,
  getById,
  getAllPagination,
  create,
  update,
  remove,
};
