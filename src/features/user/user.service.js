require('dotenv').config();
const { Account } = require('@models');
const parseFilterQuery = require('../../helpers/parseFilterQuery');
const getAll = async (data) => {
  const {
    page = process.env.PAGENUMBER_DEFAULT,
    size = process.env.PAGESIZE_DEFAULT,
    sort = process.env.SORT_DEFAULT,
    ...filter
  } = data;
  const [totalDocuments, result] = await Promise.all([
    Account.countDocuments({
      ...parseFilterQuery(filter),
      ...(filter.phoneNumber
        ? { phoneNumber: { $regex: filter.phoneNumber, $options: 'i' } }
        : {}),
      $or: [{ role: null }, { role: { $exists: false } }],
    }),
    Account.find({
      ...parseFilterQuery(filter),
      ...(filter.phoneNumber
        ? { phoneNumber: { $regex: filter.phoneNumber, $options: 'i' } }
        : {}),

      $or: [{ role: null }, { role: { $exists: false } }],
    })
      .select('-password -__v -updatedAt -deleted')
      .populate(
        'address.provinceId address.districtId address.wardId',
        'name _id'
      )
      .sort(sort)
      .limit(size)
      .skip(page * size)
      .lean()
      .exec(),
  ]);

  if (!result || !totalDocuments) throw new Error('Fetch accounts failed');
  return {
    documentList: result,
    totalDocuments,
    pageSize: size,
    pageNumber: page,
  };
};
const getById = async (id) => {
  const result = await Account.findById(id)
    .select('-password -__v  -updatedAt -deleted')
    .populate(
      'address.provinceId address.districtId address.wardId ',
      'name _id'
    )
    .lean()
    .exec();
  if (!result) throw new Error('Account not found');
  return result;
};

const remove = async (id) => {
  const result = await Account.deleteById(id).exec();
  if (!result) throw new Error('Delete account failed');
  return result;
};

const banned = async (id, data) => {
  const result = await Account.findByIdAndUpdate(id, data).exec();
  if (!result) throw new Error('Ban account failed');
  return result;
};

module.exports = {
  getAll,
  remove,
  getById,
  banned,
};
