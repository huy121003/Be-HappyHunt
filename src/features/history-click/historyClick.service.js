const { HistoryClickPost } = require('../../models');

const getAllByPostId = async (postId) => {
  const result = await HistoryClickPost.find({
    post: postId,
  })
    .populate('post', 'name _id images slug')
    .lean()
    .exec();
  if (!result) throw new Error('History click not found');
  return result;
};
const countClicksByDay = async (postId) => {
  console.log('postId', postId);
  const aa = await HistoryClickPost.find({ post: postId }).lean().exec();
  console.log('HistoryClickPost', aa);
  const clicks = await HistoryClickPost.aggregate([
    { $match: { post: Number(postId) } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  return clicks.map(({ _id, count }) => ({ date: _id, count }));
};

module.exports = {
  getAllByPostId,
  countClicksByDay,
};
