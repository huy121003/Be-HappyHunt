require('dotenv').config();
const bcrypt = require('bcrypt');

const { uploadSingle } = require('../file/file.service');

const exportFilter = require('./admin.filter');
const { Account } = require('../../models');
const getAll = async (data) => {
  const { page, size, sort, ...filter } = exportFilter(data);
  console.log('filter', filter);
  const [totalDocuments, result] = await Promise.all([
    Account.countDocuments(filter),
    Account.find(filter)
      .select('-password -__v  -updatedAt -deleted')
      .populate('role createdBy', 'name _id')
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
    .populate('role', 'name _id')
    .lean()
    .exec();
  if (!result) throw new Error('Account not found');
  return result;
};
const create = async (data) => {
  let avatarUrl = null;
  if (data.avatar) {
    avatarUrl = (await uploadSingle(data.avatar)) || null;
  }
  const hashPassword = await bcrypt.hash('123@123a', 10);

  const result = await Account.create({
    ...data,
    password: hashPassword,
    ...(avatarUrl && { avatar: avatarUrl }),
  });

  if (!result) {
    throw new Error('Create admin failed');
  }

  return result;
};

const update = async (id, data) => {
  const avatarUrl = data.avatar ? await uploadSingle(data.avatar) : null;
  const result = await Account.findByIdAndUpdate(
    id,
    {
      ...data,
      ...(avatarUrl && { avatar: avatarUrl }),
    },
    {
      new: true,
    }
  ).exec();
  if (!result) throw new Error('Update account failed');
  return result;
};
const remove = async (id) => {
  const result = await Account.deleteById(id).exec();
  if (!result) throw new Error('Delete account failed');
  return result;
};
const banned = async (id, data) => {
  const result = await Account.findByIdAndUpdate(id, data).exec();
  if (!result) throw new Error('Update status account failed');
  return result;
};

module.exports = {
  create,
  update,
  getAll,
  remove,
  getById,
  banned,
};
