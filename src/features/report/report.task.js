const cron = require('node-cron');
const { Post } = require('../../models');
const Report = require('../../models/report');
const userService = require('../user/user.service');
// delete post has >= 10 report with status APPROVED
cron.schedule('*/5 * * * *', async () => {
  try {
    const reports = await Report.aggregate([
      { $match: { status: 'APPROVED', targetType: 'post' } },
      {
        $group: {
          _id: '$target',
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gte: 5 } } },
    ]);

    if (reports.length > 0) {
      const postIds = reports.map((report) => report._id);
      await Post.updateMany(
        { _id: { $in: postIds } },
        { $set: { status: 'DELETED', deletedAt: new Date() } }
      );
    }
  } catch (error) {
    console.error('Error deleting posts with reports:', error);
  }
});


