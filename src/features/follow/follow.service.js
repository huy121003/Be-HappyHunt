const { Follower } = require('../../models');
const exportFilter = require('./follow.filter');
const { socketStore } = require('../app/app.socket');
const {
  create: createNotification,
} = require('../notification/notification.soket');
const create = async (data) => {
  try {

    const res = await Follower.create(data);
    if (!res) throw new Error('create');
    await createNotification(socketStore.appNamespace, socketStore.socketOn, {
      target: data.following,
      type: 'FOLLOW_ACCOUNT',
      createdBy: data.createdBy,
    });
    return res;
  } catch (error) {

    throw new Error(error.message);
  }
};
const remove = async (data) => {
  try {
    const result = await Follower.findOneAndDelete({
      createdBy: data.createdBy,
      following: data.following,
    }).exec();
    if (!result) throw new Error('delete');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const count = async (id) => {
  try {
    const [following, follower] = await Promise.all([
      Follower.countDocuments({ createdBy: id }),
      Follower.countDocuments({ following: id }),
    ]);
    return {
      following: following || 0,
      follower: follower || 0,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllPagination = async (data) => {
  const { page, size, sort, ...filter } = exportFilter(data);
  try {
    const [totalDocuments, result] = await Promise.all([
      Follower.countDocuments(filter),
      Follower.find(filter)
        .populate('createdBy following', '_id slug name avatar')
        .sort(sort)
        .skip(page * size)
        .limit(size)
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

const getById = async (id, following) => {
  try {
    const result = await Follower.findOne({ createdBy: id, following })
      .lean()
      .exec();
    if (!result) return false;
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  create,
  remove,
  count,
  getAllPagination,
  getById,
};
