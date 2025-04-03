const { FavoritePost } = require('../../models');
const exportFilter = require('./favoritePost.filter');

const create = async (data) => {
  try {
    const result = await FavoritePost.create(data);
    if (!result) throw new Error('create');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const remove = async (postId, userId) => {
  try {
    const result = await FavoritePost.findOneAndDelete({
      post: postId,
      createdBy: userId,
    }).lean();
    if (!result) throw new Error('delete');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllPagination = async (data) => {
  try {
    const { page, size, sort, ...filter } = exportFilter(data);
    const [totalDocuments, result] = await Promise.all([
      FavoritePost.countDocuments(filter),
      FavoritePost.find(filter)
        .limit(size)
        .skip(page * size)
        .sort(sort)
        .populate('post', 'name _id images slug status')
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
const getById = async (id, userId) => {
  try {
    const result = await FavoritePost.findOne({ post: id, createdBy: userId })
      .populate('post', 'name _id images slug')
      .lean()
      .exec();
    if (!result) throw new Error('notfound');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  create,
  remove,
  getAllPagination,
  getById,
};
