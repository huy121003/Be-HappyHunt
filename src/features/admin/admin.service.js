require('dotenv').config();
const bcrypt = require('bcrypt');

const { uploadSingle } = require('../file/file.service');

const exportFilter = require('./admin.filter');
const { Account } = require('../../models');
const getAll = async (data) => {
  try {
    const { page, size, sort, ...filter } = exportFilter(data);
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

    if (!result) {
      throw new Error('notfound');
    }

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
    const result = await Account.findById(id) // Fixed hardcoded ID
      .select('-password -__v  -updatedAt -deleted')
      .populate('role', 'name _id')
      .lean()
      .exec();
    console.log(result);
    if (!result) {
      throw new Error('notfound');
    }
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const create = async (data) => {
  try {
    let avatarUrl = null;
    if (data.avatar) {
      avatarUrl = (await uploadSingle(data.avatar)) || null;
    }
    const hashPassword = await bcrypt.hash('123@123a', 10).catch((error) => {
      throw new Error(error.message);
    });

    const result = await Account.create({
      ...data,
      password: hashPassword,
      ...(avatarUrl && { avatar: avatarUrl }),
    });

    if (!result) throw new Error('create');

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const update = async (id, data) => {
  try {
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

    if (!result) throw new Error('update');
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
  create,
  update,
  getAll,
  remove,
  getById,
  banned,
};
