const { HistoryClickPost } = require('../../models');

const getAllByPostId = async (postId) => {
  try {
    const result = await HistoryClickPost.find({
      post: postId,
    })
      .populate('post', 'name _id images slug')
      .lean()
      .exec();
    if (!result) throw new Error('notfound');
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const countClicksByDay = async (postId) => {
  try {
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
    if (!clicks) throw new Error('notfound');
    return clicks.map(({ _id, count }) => ({ date: _id, count }));
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  getAllByPostId,
  countClicksByDay,
};
