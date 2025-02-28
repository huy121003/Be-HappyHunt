const parseFilterQuery = require('../../helpers/parseFilterQuery');
const { Permission } = require('../../models');

const getAll = async () => {
  const result = Permission.find()
    .select('-__v -createdAt -updatedAt -deleted')
    .exec();
  if (!result) throw new Error('Fetch permissions failed');
  return result;
};
const getAllPagination = async (data) => {
  const {
    page = process.env.PAGENUMBER_DEFAULT,
    size = process.env.PAGESIZE_DEFAULT,
    sort = process.env.SORT_DEFAULT,
    ...filter
  } = data;

  const [totalDocuments, result] = await Promise.all([
    Permission.countDocuments(parseFilterQuery(filter)),
    Permission.find(parseFilterQuery(filter))
      .select('name _id description codeName')
      .sort(sort)
      .limit(size)
      .skip(page * size)
      .exec(),
  ]);

  if (!result || !totalDocuments) throw new Error('Fetch  permission failed');

  return {
    documentList: result,
    totalDocuments,
    pageSize: size,
    pageNumber: page,
  };
};
const getById = async (id) => {
  const result = await Permission.findById(id)
    .select('-__v -createdAt -updatedAt -deleted')
    .exec();
  if (!result) throw new Error('Permission not found');
  return result;
};
const create = async (data) => {
  const result = await Permission.create(data);
  if (!result) throw new Error('Permission creation failed');
  return result;
};
const update = async (id, data) => {
  const result = await Permission.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!result) throw new Error('Permission update failed');
  return result;
};
const remove = async (id) => {
  const result = await Permission.findByIdAndDelete(id);
  if (!result) throw new Error('Permission delete failed');
  return result;
};

module.exports = {
  getAll,
  getById,
  getAllPagination,
  create,
  update,
  remove,
};
