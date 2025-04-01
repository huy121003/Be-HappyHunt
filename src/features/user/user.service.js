require('dotenv').config();

const { Account } = require('../../models');
const exportFilter = require('./user.filter');
const getAll = async (data) => {
  try {
    const { page, size, sort, ...filter } = exportFilter(data);
    const [totalDocuments, result] = await Promise.all([
      Account.countDocuments(filter),
      Account.find(filter)
        .select('-password -__v -updatedAt -deleted')
        .populate({
          path: 'address.province address.district address.ward',
          select: 'name _id',
        })
        .sort(sort)
        .limit(size)
        .skip(page * size)
        .lean()
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
    const result = await Account.findById(id)
      .select('-password -__v  -updatedAt -deleted')
      .populate('address.province address.district address.ward ', 'name _id')
      .lean()
      .exec();
    if (!result) throw new Error('notfound');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getBySlug = async (slug) => {
  try {
    const result = await Account.findOne({ slug })
      .select('-password -__v  -updatedAt -deleted')
      .populate({ path: 'address.province', select: 'name _id' })
      .populate({ path: 'address.district', select: 'name _id' })
      .populate({ path: 'address.ward', select: 'name _id' })
      .lean()
      .exec();
    if (!result) throw new Error('notfound');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const remove = async (id) => {
  try {
    const result = await Account.deleteById(id).exec();
    if (!result) throw new Error('delete');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const banned = async (id, data) => {
  try {
    const result = await Account.findByIdAndUpdate(id, data).exec();
    if (!result) throw new Error('update');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getAll,
  remove,
  getById,
  banned,
  getBySlug,
};
