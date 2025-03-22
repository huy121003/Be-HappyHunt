const { FavoritePost } = require('../../models');
const exportFilter = require('./favoritePost.filter');

const create = async (data) => {
  const result = await FavoritePost.create(data);
  if (!result) throw new Error('Create favorite post failed');
  return result;
};
const remove = async (postId, userId) => {
  const result = await FavoritePost.findOneAndDelete({
    post: postId,
    createdBy: userId,
  }).lean();
  if (!result) throw new Error('Unfavorite post failed');
  return result;
};

const getAllPagination = async (data) => {
  const { page, size, sort, ...filter } = exportFilter(data);
  const [totalDocuments, result] = await Promise.all([
    FavoritePost.countDocuments(filter),
    FavoritePost.find(filter)
      .limit(size)
      .skip(page * size)
      .sort(sort)
      .populate('post', 'name _id images slug')
      .lean()
      .exec(),
  ]);
  if (!result) throw new Error('Fetch favorite post failed');
  if (!totalDocuments) throw new Error('Fetch total documents failed');
  return {
    documentList: result,
    totalDocuments,
    pageSize: size,
    pageNumber: page,
  };
};
const getById = async (id, userId) => {
  const result = await FavoritePost.findOne({ post: id, createdBy: userId })
    .populate('post', 'name _id images slug')
    .lean()
    .exec();
  if (!result) throw new Error('Favorite post not found');
  return result;
};
module.exports = {
  create,
  remove,
  getAllPagination,
  getById,
};
